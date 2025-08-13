Justificación de decisiones técnicas
1. ¿Por qué esta estructura arquitectónica?
- Backend modular (servicios separados lógicamente por funcionalidades) facilita testeo, despliegue y mantenibilidad.
- Elegí Node.js + Express por rapidez para prototipos y fuerte ecosistema de paquetes.
- MongoDB se escogió para prototipo por su flexibilidad con esquemas, sin embargo el diseño permite migración a Postgres si se requiere transaccionalidad más rígida.
- Uso de transacciones Mongoose (Mongo replica set) para garantizar atomicidad en la aceptación de ofertas.

2. Seguridad de transacciones y roles
- Control de roles (client/provider) debe imponerse en middlewares de autorización 
- El endpoint “accep” verifica estado “pending”  y “open” antes de aceptar

3. Escalabilidad
- Services stateless → escalar horizontalmente con contenedores (Kubernetes).
- Base de datos: lectura en replicas, sharding si volumen muy alto (Mongo sharding).
- Broker (Kafka/RabbitMQ) para desacoplar notificaciones/email desde el camino crítico.
- Redis para cache y locks distribuidos si se requiere bloqueo a nivel request.

4. Trade-offs
- MongoDB facilita desarrollo rápido; RDBMS (Postgres) daría transacciones y constraints más explícitos. Para flujos críticos, ambos sirven si se diseña bien.
- Transacciones en Mongo requieren replica set; en entorno de evaluación conviene documentarlo y usar un contenedor/instancia que soporte replica set.
