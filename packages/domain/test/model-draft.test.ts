import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { emptySnapshot } from '@semantic-forge/contracts';
import {
  PublicationBlockedError,
  StaleRevisionError,
  canPublish,
  saveDraft,
} from '../src/index.js';

describe('model draft', () => {
  it('increments revision on successful save', () => {
    const snapshot = emptySnapshot('Sales');
    const current = { revision: 3, content: snapshot };
    const next = saveDraft(current, 3, { ...snapshot, metadata: { name: 'Sales v2' } });
    assert.equal(next.revision, 4);
    assert.equal(next.content.metadata.name, 'Sales v2');
  });

  it('throws StaleRevisionError when revision mismatches', () => {
    const snapshot = emptySnapshot('Sales');
    assert.throws(
      () => saveDraft({ revision: 5, content: snapshot }, 4, snapshot),
      StaleRevisionError,
    );
  });
});

describe('publication', () => {
  it('blocks publication when validation errors exist', () => {
    assert.throws(
      () =>
        canPublish(2, 2, [
          {
            id: '1',
            ruleId: 'MODEL-001',
            category: 'STRUCTURE',
            severity: 'error',
            location: 'model',
            message: 'No fact',
            risk: 'High',
            suggestedFix: 'Add fact',
            breaking: true,
          },
        ]),
      PublicationBlockedError,
    );
  });

  it('allows publication when there are no errors', () => {
    assert.doesNotThrow(() => canPublish(2, 2, []));
  });
});
