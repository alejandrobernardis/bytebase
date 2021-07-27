import { Activity } from "./activity";
import { Bookmark } from "./bookmark";
import { Database } from "./database";
import { DataSource } from "./dataSource";
import { Environment } from "./environment";
import { CommandId, CommandRegisterId, PrincipalId } from "./id";
import { Message } from "./inbox";
import { Instance } from "./instance";
import { Issue } from "./issue";
import { Member } from "./member";
import { Pipeline, Stage, Task } from "./pipeline";
import { Principal } from "./principal";
import { Project, ProjectMember } from "./project";
import { Repository } from "./repository";
import { VCS } from "./vcs";

// System bot id
export const SYSTEM_BOT_ID = 1;

// The project to hold those databases synced from the instance but haven't been assigned an application
// project yet. We can't use UNKNOWN_ID because of referential integrity.
export const DEFAULT_PROJECT_ID = 1;

export const ALL_DATABASE_NAME = "*";

// For onboarding
export const ONBOARDING_ISSUE_ID = 101;

// For text input, we do validation if there is no further keystroke after 1s
export const TEXT_VALIDATION_DELAY = 1000;

// RowStatus
export type RowStatus = "NORMAL" | "ARCHIVED" | "PENDING_DELETE";

// Router
export type RouterSlug = {
  principalId?: PrincipalId;
  environmentSlug?: string;
  projectSlug?: string;
  issueSlug?: string;
  instanceSlug?: string;
  databaseSlug?: string;
  tableName?: string;
  dataSourceSlug?: string;
  vcsSlug?: string;
};

// Quick Action Type
export type Command = {
  id: CommandId;
  registerId: CommandRegisterId;
  run: () => void;
};

export type EnvironmentQuickActionType =
  | "quickaction.bb.environment.create"
  | "quickaction.bb.environment.reorder";
export type ProjectQuickActionType = "quickaction.bb.project.create";
export type InstanceQuickActionType = "quickaction.bb.instance.create";
export type UserQuickActionType = "quickaction.bb.user.manage";
export type DatabaseQuickActionType =
  | "quickaction.bb.database.create" // Used by DBA and Owner
  | "quickaction.bb.database.request" // Used by Developer
  | "quickaction.bb.database.schema.update"
  | "quickaction.bb.database.troubleshoot";

export type QuickActionType =
  | EnvironmentQuickActionType
  | ProjectQuickActionType
  | InstanceQuickActionType
  | UserQuickActionType
  | DatabaseQuickActionType;

// unknown represents an anomaly.
// Returns as function to avoid caller accidentally mutate it.
// UNKNOWN_ID means an anomaly, it expects a resource which is missing (e.g. Keyed lookup missing).
export const UNKNOWN_ID = -1;
// EMPTY_ID means an expected behavior, it expects no resource (e.g. contains an empty value, using this technic enables
// us to declare variable as required, which leads to cleaner code)
export const EMPTY_ID = 0;

export type ResourceType =
  | "PRINCIPAL"
  | "MEMBER"
  | "ENVIRONMENT"
  | "PROJECT"
  | "PROJECT_MEMBER"
  | "INSTANCE"
  | "DATABASE"
  | "DATA_SOURCE"
  | "ISSUE"
  | "PIPELINE"
  | "STAGE"
  | "TASK"
  | "ACTIVITY"
  | "MESSAGE"
  | "BOOKMARK"
  | "VCS"
  | "REPOSITORY";

export const unknown = (
  type: ResourceType
):
  | Principal
  | Member
  | Environment
  | Project
  | ProjectMember
  | Instance
  | Database
  | DataSource
  | Issue
  | Pipeline
  | Stage
  | Task
  | Activity
  | Message
  | Bookmark
  | VCS
  | Repository => {
  // Have to omit creator and updater to avoid recursion.
  const UNKNOWN_PRINCIPAL: Principal = {
    id: UNKNOWN_ID,
    creatorId: UNKNOWN_ID,
    createdTs: 0,
    updaterId: UNKNOWN_ID,
    updatedTs: 0,
    type: "END_USER",
    name: "<<Unknown principal>>",
    email: "",
    role: "DEVELOPER",
  } as Principal;

  const UNKNOWN_MEMBER: Member = {
    id: UNKNOWN_ID,
    rowStatus: "NORMAL",
    creator: UNKNOWN_PRINCIPAL,
    updater: UNKNOWN_PRINCIPAL,
    createdTs: 0,
    updatedTs: 0,
    status: "ACTIVE",
    role: "DEVELOPER",
    principal: UNKNOWN_PRINCIPAL,
  };

  const UNKNOWN_ENVIRONMENT: Environment = {
    id: UNKNOWN_ID,
    creator: UNKNOWN_PRINCIPAL,
    updater: UNKNOWN_PRINCIPAL,
    createdTs: 0,
    updatedTs: 0,
    rowStatus: "NORMAL",
    name: "<<Unknown environment>>",
    order: 0,
  };

  const UNKNOWN_PROJECT: Project = {
    id: UNKNOWN_ID,
    rowStatus: "NORMAL",
    name: "<<Unknown project>>",
    key: "UNK",
    creator: UNKNOWN_PRINCIPAL,
    updater: UNKNOWN_PRINCIPAL,
    createdTs: 0,
    updatedTs: 0,
    memberList: [],
    workflowType: "UI",
    visibility: "PUBLIC",
  };

  const UNKNOWN_PROJECT_MEMBER: ProjectMember = {
    id: UNKNOWN_ID,
    project: UNKNOWN_PROJECT,
    creator: UNKNOWN_PRINCIPAL,
    updater: UNKNOWN_PRINCIPAL,
    createdTs: 0,
    updatedTs: 0,
    role: "DEVELOPER",
    principal: UNKNOWN_PRINCIPAL,
  };

  const UNKNOWN_INSTANCE: Instance = {
    id: UNKNOWN_ID,
    rowStatus: "NORMAL",
    environment: UNKNOWN_ENVIRONMENT,
    creator: UNKNOWN_PRINCIPAL,
    updater: UNKNOWN_PRINCIPAL,
    createdTs: 0,
    updatedTs: 0,
    name: "<<Unknown instance>>",
    engine: "MYSQL",
    host: "",
  };

  const UNKNOWN_DATABASE: Database = {
    id: UNKNOWN_ID,
    instance: UNKNOWN_INSTANCE,
    project: UNKNOWN_PROJECT,
    dataSourceList: [],
    creator: UNKNOWN_PRINCIPAL,
    createdTs: 0,
    updater: UNKNOWN_PRINCIPAL,
    updatedTs: 0,
    name: "<<Unknown database>>",
    characterSet: "",
    collation: "",
    syncStatus: "NOT_FOUND",
    lastSuccessfulSyncTs: 0,
  };

  const UNKNOWN_DATA_SOURCE: DataSource = {
    id: UNKNOWN_ID,
    instance: UNKNOWN_INSTANCE,
    database: UNKNOWN_DATABASE,
    creator: UNKNOWN_PRINCIPAL,
    createdTs: 0,
    updater: UNKNOWN_PRINCIPAL,
    updatedTs: 0,
    memberList: [],
    name: "<<Unknown data source>>",
    type: "RO",
  };

  const UNKNOWN_PIPELINE: Pipeline = {
    id: UNKNOWN_ID,
    creator: UNKNOWN_PRINCIPAL,
    createdTs: 0,
    updater: UNKNOWN_PRINCIPAL,
    updatedTs: 0,
    name: "<<Unknown pipeline>>",
    status: "DONE",
    stageList: [],
  };

  const UNKNOWN_ISSUE: Issue = {
    id: UNKNOWN_ID,
    project: UNKNOWN_PROJECT,
    pipeline: UNKNOWN_PIPELINE,
    creator: UNKNOWN_PRINCIPAL,
    createdTs: 0,
    updater: UNKNOWN_PRINCIPAL,
    updatedTs: 0,
    name: "<<Unknown issue>>",
    status: "DONE",
    type: "bb.issue.general",
    description: "",
    subscriberIdList: [],
    payload: {},
  };

  const UNKNOWN_STAGE: Stage = {
    id: UNKNOWN_ID,
    pipeline: UNKNOWN_PIPELINE,
    creator: UNKNOWN_PRINCIPAL,
    createdTs: 0,
    updater: UNKNOWN_PRINCIPAL,
    updatedTs: 0,
    name: "<<Unknown stage>>",
    environment: UNKNOWN_ENVIRONMENT,
    taskList: [],
  };

  const UNKNOWN_TASK: Task = {
    id: UNKNOWN_ID,
    pipeline: UNKNOWN_PIPELINE,
    stage: UNKNOWN_STAGE,
    creator: UNKNOWN_PRINCIPAL,
    createdTs: 0,
    updater: UNKNOWN_PRINCIPAL,
    updatedTs: 0,
    name: "<<Unknown task>>",
    type: "bb.task.general",
    status: "DONE",
    instance: UNKNOWN_INSTANCE,
    database: UNKNOWN_DATABASE,
    taskRunList: [],
  };

  const UNKNOWN_ACTIVITY: Activity = {
    id: UNKNOWN_ID,
    containerId: UNKNOWN_ID,
    createdTs: 0,
    updatedTs: 0,
    actionType: "bb.issue.create",
    creator: UNKNOWN_PRINCIPAL,
    updater: UNKNOWN_PRINCIPAL,
    comment: "<<Unknown comment>>",
  };

  const UNKNOWN_MESSAGE: Message = {
    id: UNKNOWN_ID,
    containerId: UNKNOWN_ID,
    creator: UNKNOWN_PRINCIPAL,
    createdTs: 0,
    updater: UNKNOWN_PRINCIPAL,
    updatedTs: 0,
    type: "bb.message.issue.assign",
    status: "CONSUMED",
    description: "",
    receiver: UNKNOWN_PRINCIPAL,
  };

  const UNKNOWN_BOOKMARK: Bookmark = {
    id: UNKNOWN_ID,
    creator: UNKNOWN_PRINCIPAL,
    updater: UNKNOWN_PRINCIPAL,
    createdTs: 0,
    updatedTs: 0,
    name: "",
    link: "",
  };

  const UNKNOWN_VCS: VCS = {
    id: UNKNOWN_ID,
    creator: UNKNOWN_PRINCIPAL,
    updater: UNKNOWN_PRINCIPAL,
    createdTs: 0,
    updatedTs: 0,
    name: "",
    type: "GITLAB_SELF_HOST",
    instanceURL: "",
    apiURL: "",
    applicationId: "",
    secret: "",
  };

  const UNKONWN_REPOSITORY: Repository = {
    id: UNKNOWN_ID,
    creator: UNKNOWN_PRINCIPAL,
    updater: UNKNOWN_PRINCIPAL,
    createdTs: 0,
    updatedTs: 0,
    vcs: UNKNOWN_VCS,
    project: UNKNOWN_PROJECT,
    name: "",
    fullPath: "",
    webURL: "",
    baseDirectory: "",
    branchFilter: "",
    externalId: UNKNOWN_ID.toString(),
  };

  switch (type) {
    case "PRINCIPAL":
      return UNKNOWN_PRINCIPAL;
    case "MEMBER":
      return UNKNOWN_MEMBER;
    case "ENVIRONMENT":
      return UNKNOWN_ENVIRONMENT;
    case "PROJECT":
      return UNKNOWN_PROJECT;
    case "PROJECT_MEMBER":
      return UNKNOWN_PROJECT_MEMBER;
    case "INSTANCE":
      return UNKNOWN_INSTANCE;
    case "DATABASE":
      return UNKNOWN_DATABASE;
    case "DATA_SOURCE":
      return UNKNOWN_DATA_SOURCE;
    case "ISSUE":
      return UNKNOWN_ISSUE;
    case "PIPELINE":
      return UNKNOWN_PIPELINE;
    case "STAGE":
      return UNKNOWN_STAGE;
    case "TASK":
      return UNKNOWN_TASK;
    case "ACTIVITY":
      return UNKNOWN_ACTIVITY;
    case "MESSAGE":
      return UNKNOWN_MESSAGE;
    case "BOOKMARK":
      return UNKNOWN_BOOKMARK;
    case "VCS":
      return UNKNOWN_VCS;
    case "REPOSITORY":
      return UNKONWN_REPOSITORY;
  }
};

// empty represents an expected behavior.
export const empty = (
  type: ResourceType
):
  | Principal
  | Member
  | Environment
  | Project
  | ProjectMember
  | Instance
  | Database
  | DataSource
  | Issue
  | Pipeline
  | Stage
  | Task
  | Activity
  | Message
  | Bookmark
  | VCS
  | Repository => {
  // Have to omit creator and updater to avoid recursion.
  const EMPTY_PRINCIPAL: Principal = {
    id: EMPTY_ID,
    createdTs: 0,
    updatedTs: 0,
    type: "END_USER",
    name: "",
    email: "",
    role: "DEVELOPER",
  } as Principal;

  const EMPTY_MEMBER: Member = {
    id: EMPTY_ID,
    rowStatus: "NORMAL",
    creator: EMPTY_PRINCIPAL,
    updater: EMPTY_PRINCIPAL,
    createdTs: 0,
    updatedTs: 0,
    status: "ACTIVE",
    role: "DEVELOPER",
    principal: EMPTY_PRINCIPAL,
  };

  const EMPTY_ENVIRONMENT: Environment = {
    id: EMPTY_ID,
    creator: EMPTY_PRINCIPAL,
    updater: EMPTY_PRINCIPAL,
    createdTs: 0,
    updatedTs: 0,
    rowStatus: "NORMAL",
    name: "",
    order: 0,
  };

  const EMPTY_PROJECT: Project = {
    id: EMPTY_ID,
    rowStatus: "NORMAL",
    name: "",
    key: "",
    creator: EMPTY_PRINCIPAL,
    updater: EMPTY_PRINCIPAL,
    createdTs: 0,
    updatedTs: 0,
    memberList: [],
    workflowType: "UI",
    visibility: "PUBLIC",
  };

  const EMPTY_PROJECT_MEMBER: ProjectMember = {
    id: EMPTY_ID,
    project: EMPTY_PROJECT,
    creator: EMPTY_PRINCIPAL,
    updater: EMPTY_PRINCIPAL,
    createdTs: 0,
    updatedTs: 0,
    role: "DEVELOPER",
    principal: EMPTY_PRINCIPAL,
  };

  const EMPTY_INSTANCE: Instance = {
    id: EMPTY_ID,
    rowStatus: "NORMAL",
    environment: EMPTY_ENVIRONMENT,
    creator: EMPTY_PRINCIPAL,
    updater: EMPTY_PRINCIPAL,
    createdTs: 0,
    updatedTs: 0,
    name: "",
    engine: "MYSQL",
    host: "",
  };

  const EMPTY_DATABASE: Database = {
    id: EMPTY_ID,
    instance: EMPTY_INSTANCE,
    project: EMPTY_PROJECT,
    dataSourceList: [],
    creator: EMPTY_PRINCIPAL,
    createdTs: 0,
    updater: EMPTY_PRINCIPAL,
    updatedTs: 0,
    name: "",
    characterSet: "",
    collation: "",
    syncStatus: "NOT_FOUND",
    lastSuccessfulSyncTs: 0,
  };

  const EMPTY_DATA_SOURCE: DataSource = {
    id: EMPTY_ID,
    instance: EMPTY_INSTANCE,
    database: EMPTY_DATABASE,
    creator: EMPTY_PRINCIPAL,
    createdTs: 0,
    updater: EMPTY_PRINCIPAL,
    updatedTs: 0,
    memberList: [],
    name: "",
    type: "RO",
  };

  const EMPTY_PIPELINE: Pipeline = {
    id: EMPTY_ID,
    creator: EMPTY_PRINCIPAL,
    createdTs: 0,
    updater: EMPTY_PRINCIPAL,
    updatedTs: 0,
    name: "",
    status: "DONE",
    stageList: [],
  };

  const EMPTY_ISSUE: Issue = {
    id: EMPTY_ID,
    pipeline: EMPTY_PIPELINE,
    project: EMPTY_PROJECT,
    creator: EMPTY_PRINCIPAL,
    createdTs: 0,
    updater: EMPTY_PRINCIPAL,
    updatedTs: 0,
    name: "",
    status: "DONE",
    type: "bb.issue.general",
    description: "",
    subscriberIdList: [],
    payload: {},
  };

  const EMPTY_STAGE: Stage = {
    id: EMPTY_ID,
    pipeline: EMPTY_PIPELINE,
    creator: EMPTY_PRINCIPAL,
    createdTs: 0,
    updater: EMPTY_PRINCIPAL,
    updatedTs: 0,
    name: "",
    environment: EMPTY_ENVIRONMENT,
    taskList: [],
  };

  const EMPTY_TASK: Task = {
    id: EMPTY_ID,
    pipeline: EMPTY_PIPELINE,
    stage: EMPTY_STAGE,
    creator: EMPTY_PRINCIPAL,
    createdTs: 0,
    updater: EMPTY_PRINCIPAL,
    updatedTs: 0,
    name: "",
    type: "bb.task.general",
    status: "DONE",
    instance: EMPTY_INSTANCE,
    database: EMPTY_DATABASE,
    taskRunList: [],
  };

  const EMPTY_ACTIVITY: Activity = {
    id: EMPTY_ID,
    containerId: EMPTY_ID,
    createdTs: 0,
    updatedTs: 0,
    actionType: "bb.issue.create",
    creator: EMPTY_PRINCIPAL,
    updater: EMPTY_PRINCIPAL,
    comment: "",
  };

  const EMPTY_MESSAGE: Message = {
    id: EMPTY_ID,
    containerId: EMPTY_ID,
    creator: EMPTY_PRINCIPAL,
    createdTs: 0,
    updater: EMPTY_PRINCIPAL,
    updatedTs: 0,
    type: "bb.message.issue.assign",
    status: "DELIVERED",
    description: "",
    receiver: EMPTY_PRINCIPAL,
  };

  const EMPTY_BOOKMARK: Bookmark = {
    id: EMPTY_ID,
    creator: EMPTY_PRINCIPAL,
    updater: EMPTY_PRINCIPAL,
    createdTs: 0,
    updatedTs: 0,
    name: "",
    link: "",
  };

  const EMPTY_VCS: VCS = {
    id: EMPTY_ID,
    creator: EMPTY_PRINCIPAL,
    updater: EMPTY_PRINCIPAL,
    createdTs: 0,
    updatedTs: 0,
    name: "",
    type: "GITLAB_SELF_HOST",
    instanceURL: "",
    apiURL: "",
    applicationId: "",
    secret: "",
  };

  const EMPTY_REPOSITORY: Repository = {
    id: EMPTY_ID,
    creator: EMPTY_PRINCIPAL,
    updater: EMPTY_PRINCIPAL,
    createdTs: 0,
    updatedTs: 0,
    vcs: EMPTY_VCS,
    project: EMPTY_PROJECT,
    name: "",
    fullPath: "",
    webURL: "",
    baseDirectory: "",
    branchFilter: "",
    externalId: EMPTY_ID.toString(),
  };

  switch (type) {
    case "PRINCIPAL":
      return EMPTY_PRINCIPAL;
    case "MEMBER":
      return EMPTY_MEMBER;
    case "ENVIRONMENT":
      return EMPTY_ENVIRONMENT;
    case "PROJECT":
      return EMPTY_PROJECT;
    case "PROJECT_MEMBER":
      return EMPTY_PROJECT_MEMBER;
    case "INSTANCE":
      return EMPTY_INSTANCE;
    case "DATABASE":
      return EMPTY_DATABASE;
    case "DATA_SOURCE":
      return EMPTY_DATA_SOURCE;
    case "ISSUE":
      return EMPTY_ISSUE;
    case "PIPELINE":
      return EMPTY_PIPELINE;
    case "STAGE":
      return EMPTY_STAGE;
    case "TASK":
      return EMPTY_TASK;
    case "ACTIVITY":
      return EMPTY_ACTIVITY;
    case "MESSAGE":
      return EMPTY_MESSAGE;
    case "BOOKMARK":
      return EMPTY_BOOKMARK;
    case "VCS":
      return EMPTY_VCS;
    case "REPOSITORY":
      return EMPTY_REPOSITORY;
  }
};
