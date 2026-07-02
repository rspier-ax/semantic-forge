namespace semanticforge;

using { cuid, managed } from '@sap/cds/common';

entity SemanticModels : managed {
  key ID                    : UUID;
      name                  : String(255);
      status                : String(20) default 'draft';
      revision              : Integer default 1;
      publishedVersionNumber: Integer;
      draftContent          : LargeString;
}

entity ModelVersions : managed {
  key ID                : UUID;
      model               : Association to SemanticModels;
      versionNumber       : Integer;
      snapshot            : LargeString;
      checksum            : String(64);
      publicationComment  : String(500);
      publishedBy         : String(100);
      publishedAt         : Timestamp;
}

entity ValidationRuns : managed {
  key ID            : UUID;
      model           : Association to SemanticModels;
      revision        : Integer;
      rulesExecuted   : Integer;
      issues          : Composition of many ValidationIssues on issues.run = $self;
}

entity ValidationIssues {
  key ID          : UUID;
      run           : Association to ValidationRuns;
      ruleId        : String(20);
      category      : String(30);
      severity      : String(10);
      message       : String(500);
      risk          : String(500);
      suggestedFix  : String(500);
      location      : String(255);
      breaking      : Boolean default false;
}

entity AuditEvents : managed {
  key ID        : UUID;
      model       : Association to SemanticModels;
      eventType   : String(50);
      actor       : String(100);
      details     : String(1000);
}
