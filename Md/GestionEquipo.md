Gestión del desarrollo (equipo 2-3 devs)
Organización de sprints (2 semanas)
- Sprint 0 (setup): infra, repositorio, CI, DB y README.
- Sprint 1: MVP endpoints básicos (create request, create offer, list offers).
- Sprint 2: Implementación de flujo crítico (accept/reject/counter) + tests.
- Sprint 3: Auth & roles, validaciones, seguridad, documentación.
- Sprint 4: Observabilidad, carga y mejoras UI.

Asignación de tareas (3 devs)
- Dev A: Backend core (models, requests, offers) + DB.
- Dev B: Decisiones (accept/reject/counter), transacciones y tests E2E.
- Dev C: Auth/roles, infra (Docker/K8s), CI/CD scripts y monitoring.

Metodologías y revisión de código
- SCM: GitFlow o trunk-based según preferencia (recomiendo trunk + short-lived feature branches).
- PR obligatorio con 1 reviewer mínimo.
- Code reviews con checklist (seguridad, tests, documentación).

CI/CD propuestas
- Pipelines: lint → unit tests → build → deploy a staging.
- Usa GitHub Actions/GitLab CI.
- Deploy automático a staging cuando PR merge; deploy a producción por release tag/manual approval.
- Policies: no merge si tests fallan; escaneo SAST básico.

QA y pruebas
- Tests unitarios por controlador/modelo (Jest), tests de integración con mongodb-memory-server o instancia de test.
- Tests E2E (supertest) para flujo crítico: create request -> create offers -> accept offer.
