using { semanticforge as db } from '../db/schema';

service ModelService @(path: '/odata/v4/model') {
  entity Models          as projection on db.SemanticModels;
  entity ModelVersions   as projection on db.ModelVersions;
  entity ValidationRuns  as projection on db.ValidationRuns;
  entity AuditEvents     as projection on db.AuditEvents;

  action validateModel(modelId: UUID, revision: Integer) returns {
    runId   : UUID;
    issues  : array of {
      id          : UUID;
      ruleId      : String;
      category    : String;
      severity    : String;
      message     : String;
      risk        : String;
      suggestedFix: String;
      location    : String;
      breaking    : Boolean;
    };
  };

  action publishModel(modelId: UUID, revision: Integer, comment: String) returns {
    versionNumber : Integer;
    checksum      : String;
  };
}
