package handlers

import "time"

// formatTrunc handles disparate date formats between PostgreSQL (time.Time)
// and SQLite (string) when scanning truncated date columns.
func formatTrunc(v interface{}) string {
	if v == nil {
		return ""
	}
	if t, ok := v.(time.Time); ok {
		return t.Format("2006-01")
	}
	if s, ok := v.(string); ok {
		if len(s) >= 7 {
			return s[:7]
		}
		return s
	}
	return ""
}
