package api

import (
	"context"
	"encoding/json"

	"github.com/bytebase/bytebase/common"
	"github.com/bytebase/bytebase/plugin/db"
	"github.com/bytebase/bytebase/plugin/vcs"
)

// These are special onboarding tasks for demo purpose when bootstraping the workspace.

// OnboardingTaskID1 is the ID for onboarding task1.
const OnboardingTaskID1 = 101

// OnboardingTaskID2 is the ID for onboarding task2.
const OnboardingTaskID2 = 102

// TaskStatus is the status of a task.
type TaskStatus string

const (
	// TaskPending is the task status for PENDING.
	TaskPending TaskStatus = "PENDING"
	// TaskPendingApproval is the task status for PENDING_APPROVAL.
	TaskPendingApproval TaskStatus = "PENDING_APPROVAL"
	// TaskRunning is the task status for RUNNING.
	TaskRunning TaskStatus = "RUNNING"
	// TaskDone is the task status for DONE.
	TaskDone TaskStatus = "DONE"
	// TaskFailed is the task status for FAILED.
	TaskFailed TaskStatus = "FAILED"
	// TaskCanceled is the task status for CANCELED.
	TaskCanceled TaskStatus = "CANCELED"
)

func (e TaskStatus) String() string {
	switch e {
	case TaskPending:
		return "PENDING"
	case TaskPendingApproval:
		return "PENDING_APPROVAL"
	case TaskRunning:
		return "RUNNING"
	case TaskDone:
		return "DONE"
	case TaskFailed:
		return "FAILED"
	case TaskCanceled:
		return "CANCELED"
	}
	return "UNKNOWN"
}

// TaskType is the type of a task.
type TaskType string

const (
	// TaskGeneral is the task type for general tasks.
	TaskGeneral TaskType = "bb.task.general"
	// TaskDatabaseCreate is the task type for creating databases.
	TaskDatabaseCreate TaskType = "bb.task.database.create"
	// TaskDatabaseSchemaUpdate is the task type for updating database schemas.
	TaskDatabaseSchemaUpdate TaskType = "bb.task.database.schema.update"
	// TaskDatabaseDataUpdate is the task type for updating database data.
	TaskDatabaseDataUpdate TaskType = "bb.task.database.data.update"
	// TaskDatabaseBackup is the task type for creating database backups.
	TaskDatabaseBackup TaskType = "bb.task.database.backup"
	// TaskDatabaseRestore is the task type for restoring databases.
	TaskDatabaseRestore TaskType = "bb.task.database.restore"
)

// These payload types are only used when marshalling to the json format for saving into the database.
// So we annotate with json tag using camelCase naming which is consistent with normal
// json naming convention

// TaskDatabaseCreatePayload is the task payload for creating databases.
type TaskDatabaseCreatePayload struct {
	// The project owning the database.
	ProjectID     int    `json:"projectId,omitempty"`
	DatabaseName  string `json:"databaseName,omitempty"`
	Statement     string `json:"statement,omitempty"`
	CharacterSet  string `json:"character,omitempty"`
	Collation     string `json:"collation,omitempty"`
	Labels        string `json:"labels,omitempty"`
	SchemaVersion string `json:"schemaVersion,omitempty"`
}

// TaskDatabaseSchemaUpdatePayload is the task payload for database schema update (DDL).
type TaskDatabaseSchemaUpdatePayload struct {
	MigrationType db.MigrationType `json:"migrationType,omitempty"`
	Statement     string           `json:"statement,omitempty"`
	SchemaVersion string           `json:"schemaVersion,omitempty"`
	VCSPushEvent  *vcs.PushEvent   `json:"pushEvent,omitempty"`
}

// TaskDatabaseDataUpdatePayload is the task payload for database data update (DML).
type TaskDatabaseDataUpdatePayload struct {
	Statement     string         `json:"statement,omitempty"`
	SchemaVersion string         `json:"schemaVersion,omitempty"`
	VCSPushEvent  *vcs.PushEvent `json:"pushEvent,omitempty"`
}

// TaskDatabaseBackupPayload is the task payload for database backup.
type TaskDatabaseBackupPayload struct {
	BackupID int `json:"backupId,omitempty"`
}

// TaskDatabaseRestorePayload is the task payload for database restore.
type TaskDatabaseRestorePayload struct {
	// The database name we restore to. When we restore a backup to a new database, we only have the database name
	// and don't have the database id upon constructing the task yet.
	DatabaseName string `json:"databaseName,omitempty"`
	BackupID     int    `json:"backupId,omitempty"`
}

// TaskRaw is the store model for an Task.
// Fields have exactly the same meanings as Task.
type TaskRaw struct {
	ID int

	// Standard fields
	CreatorID int
	CreatedTs int64
	UpdaterID int
	UpdatedTs int64

	// Related fields
	PipelineID int
	StageID    int
	InstanceID int
	// Could be empty for creating database task when the task isn't yet completed successfully.
	DatabaseID          *int
	TaskRunRawList      []*TaskRunRaw
	TaskCheckRunRawList []*TaskCheckRunRaw

	// Domain specific fields
	Name              string
	Status            TaskStatus
	Type              TaskType
	Payload           string
	EarliestAllowedTs int64
}

// ToTask creates an instance of Task based on the TaskRaw.
// This is intended to be called when we need to compose an Task relationship.
func (raw *TaskRaw) ToTask() *Task {
	return &Task{
		ID: raw.ID,

		// Standard fields
		CreatorID: raw.CreatorID,
		CreatedTs: raw.CreatedTs,
		UpdaterID: raw.UpdaterID,
		UpdatedTs: raw.UpdatedTs,

		// Related fields
		PipelineID: raw.PipelineID,
		StageID:    raw.StageID,
		InstanceID: raw.InstanceID,
		// Could be empty for creating database task when the task isn't yet completed successfully.
		DatabaseID: raw.DatabaseID,

		// Domain specific fields
		Name:              raw.Name,
		Status:            raw.Status,
		Type:              raw.Type,
		Payload:           raw.Payload,
		EarliestAllowedTs: raw.EarliestAllowedTs,
	}
}

// Task is the API message for a task.
type Task struct {
	ID int `jsonapi:"primary,task"`

	// Standard fields
	CreatorID int
	Creator   *Principal `jsonapi:"relation,creator"`
	CreatedTs int64      `jsonapi:"attr,createdTs"`
	UpdaterID int
	Updater   *Principal `jsonapi:"relation,updater"`
	UpdatedTs int64      `jsonapi:"attr,updatedTs"`

	// Related fields
	// Just returns PipelineID and StageID otherwise would cause circular dependency.
	PipelineID int `jsonapi:"attr,pipelineId"`
	StageID    int `jsonapi:"attr,stageId"`
	InstanceID int
	Instance   *Instance `jsonapi:"relation,instance"`
	// Could be empty for creating database task when the task isn't yet completed successfully.
	DatabaseID       *int
	Database         *Database       `jsonapi:"relation,database"`
	TaskRunList      []*TaskRun      `jsonapi:"relation,taskRun"`
	TaskCheckRunList []*TaskCheckRun `jsonapi:"relation,taskCheckRun"`

	// Domain specific fields
	Name              string     `jsonapi:"attr,name"`
	Status            TaskStatus `jsonapi:"attr,status"`
	Type              TaskType   `jsonapi:"attr,type"`
	Payload           string     `jsonapi:"attr,payload"`
	EarliestAllowedTs int64      `jsonapi:"attr,earliestAllowedTs"`
}

// ToRaw converts a Task to TaskRaw.
// TODO(dragonly): This is a hack for function `createIssue`. We MUST review the code and remove this hack.
func (task *Task) ToRaw() *TaskRaw {
	return &TaskRaw{
		ID: task.ID,

		// Standard fields
		CreatorID: task.CreatorID,
		CreatedTs: task.CreatedTs,
		UpdaterID: task.UpdaterID,
		UpdatedTs: task.UpdatedTs,

		// Related fields
		PipelineID: task.PipelineID,
		StageID:    task.StageID,
		InstanceID: task.InstanceID,
		DatabaseID: task.DatabaseID,

		// Domain specific fields
		Name:              task.Name,
		Status:            task.Status,
		Type:              task.Type,
		Payload:           task.Payload,
		EarliestAllowedTs: task.EarliestAllowedTs,
	}
}

// TaskCreate is the API message for creating a task.
type TaskCreate struct {
	// Standard fields
	// Value is assigned from the jwt subject field passed by the client.
	CreatorID int

	// Related fields
	PipelineID int
	StageID    int
	InstanceID int `jsonapi:"attr,instanceId"`
	// Tasks like creating database may not have database.
	DatabaseID *int `jsonapi:"attr,databaseId"`

	// Domain specific fields
	Name   string     `jsonapi:"attr,name"`
	Status TaskStatus `jsonapi:"attr,status"`
	Type   TaskType   `jsonapi:"attr,type"`
	// Payload is derived from fields below it
	Payload           string
	EarliestAllowedTs int64  `jsonapi:"attr,earliestAllowedTs"`
	Statement         string `jsonapi:"attr,statement"`
	DatabaseName      string `jsonapi:"attr,databaseName"`
	CharacterSet      string `jsonapi:"attr,characterSet"`
	Collation         string `jsonapi:"attr,collation"`
	Labels            string `jsonapi:"attr,labels"`
	BackupID          *int   `jsonapi:"attr,backupId"`
	VCSPushEvent      *vcs.PushEvent
	MigrationType     db.MigrationType `jsonapi:"attr,migrationType"`
}

// TaskFind is the API message for finding tasks.
type TaskFind struct {
	ID *int

	// Related fields
	PipelineID *int
	StageID    *int

	// Domain specific fields
	StatusList *[]TaskStatus
}

func (find *TaskFind) String() string {
	str, err := json.Marshal(*find)
	if err != nil {
		return err.Error()
	}
	return string(str)
}

// TaskPatch is the API message for patching a task.
type TaskPatch struct {
	ID int

	// Standard fields
	// Value is assigned from the jwt subject field passed by the client.
	UpdaterID int

	// Domain specific fields
	DatabaseID        *int
	Statement         *string `jsonapi:"attr,statement"`
	Payload           *string
	EarliestAllowedTs *int64 `jsonapi:"attr,earliestAllowedTs"`
}

// TaskStatusPatch is the API message for patching a task status.
type TaskStatusPatch struct {
	ID int

	// Standard fields
	// Value is assigned from the jwt subject field passed by the client.
	UpdaterID int

	// Domain specific fields
	Status  TaskStatus `jsonapi:"attr,status"`
	Code    *common.Code
	Comment *string `jsonapi:"attr,comment"`
	Result  *string
}

// TaskService is the service for tasks.
type TaskService interface {
	CreateTask(ctx context.Context, create *TaskCreate) (*TaskRaw, error)
	FindTaskList(ctx context.Context, find *TaskFind) ([]*TaskRaw, error)
	FindTask(ctx context.Context, find *TaskFind) (*TaskRaw, error)
	PatchTask(ctx context.Context, patch *TaskPatch) (*TaskRaw, error)
	PatchTaskStatus(ctx context.Context, patch *TaskStatusPatch) (*TaskRaw, error)
}
