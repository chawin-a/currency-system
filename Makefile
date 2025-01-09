migrate-up:
	migrate -path migrations -database "postgres://postgres:12345678@localhost:5432/postgres?sslmode=disable" up
migrate-down:
	migrate -path migrations -database "postgres://postgres:12345678@localhost:5432/postgres?sslmode=disable" down -all