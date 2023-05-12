DOCKERFILE = ./docker-compose.yaml
DOCKERDIR = ./

up:
	docker compose -f ${DOCKERFILE} --project-directory ${DOCKERDIR} up
stop:
	docker compose -f ${DOCKERFILE} --project-directory ${DOCKERDIR} stop
down: 
	docker compose -f ${DOCKERFILE} --project-directory ${DOCKERDIR} down
logs:
	docker compose -f ${DOCKERFILE} --project-directory ${DOCKERDIR} logs --follow ${c}
prune:
	docker system prune --all --force --volumes