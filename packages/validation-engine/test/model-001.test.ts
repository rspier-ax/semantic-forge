import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { emptySnapshot } from '@semantic-forge/contracts';
import { runValidation } from '../src/index.js';

describe('MODEL-001', () => {
  it('reports error when model has no fact entity', () => {
    const snapshot = emptySnapshot('Incomplete');
    snapshot.entities = [
      { id: 'd1', name: 'Region', role: 'dimension' },
    ];
    const { issues, rulesExecuted } = runValidation(snapshot);
    assert.equal(rulesExecuted, 1);
    assert.equal(issues.length, 1);
    assert.equal(issues[0]?.ruleId, 'MODEL-001');
    assert.equal(issues[0]?.severity, 'error');
  });

  it('passes when a fact entity exists', () => {
    const snapshot = emptySnapshot('Sales');
    snapshot.entities = [
      { id: 'f1', name: 'Sales', role: 'fact' },
      { id: 'd1', name: 'Region', role: 'dimension' },
    ];
    const { issues, rulesExecuted } = runValidation(snapshot);
    assert.equal(rulesExecuted, 1);
    assert.equal(issues.length, 0);
  });
});
