package mysql

import (
	"github.com/bytebase/bytebase/plugin/advisor"
	"github.com/bytebase/bytebase/plugin/db"

	"github.com/pingcap/parser"

	_ "github.com/pingcap/tidb/types/parser_driver"
)

var (
	_ advisor.Advisor = (*Advisor)(nil)
)

func init() {
	advisor.Register(db.MySQL, advisor.MySQLSyntax, &Advisor{})
	advisor.Register(db.TiDB, advisor.MySQLSyntax, &Advisor{})
}

type Advisor struct {
}

// A fake advisor to report 1 advice for each severity.
func (adv *Advisor) Check(ctx advisor.AdvisorContext, statement string) ([]advisor.Advice, error) {
	p := parser.New()

	_, warns, err := p.Parse(statement, ctx.Charset, ctx.Collation)
	if err != nil {
		return []advisor.Advice{
			{
				Status:  advisor.Error,
				Title:   "Syntax error",
				Content: err.Error(),
			},
		}, nil
	}

	advisorList := []advisor.Advice{}
	for _, warn := range warns {
		advisorList = append(advisorList, advisor.Advice{
			Status:  advisor.Warn,
			Title:   "Syntax Warning",
			Content: warn.Error(),
		})
	}

	advisorList = append(advisorList, advisor.Advice{
		Status:  advisor.Success,
		Title:   "Syntax OK",
		Content: "OK"})
	return advisorList, nil
}
