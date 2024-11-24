import { db } from './database/connection.database.js';

const createTables = async () => {
    const roles = `
        CREATE TABLE ROLES (
        RID SERIAL PRIMARY KEY,
        NAME VARCHAR(50) NOT NULL UNIQUE CHECK (NAME IN ('ADMIN', 'SUPER', 'CLIENT'))
        );
    `;
    const insertRoles = `
        INSERT INTO ROLES (NAME) VALUES ('ADMIN');
        INSERT INTO ROLES (NAME) VALUES ('SUPER');
        INSERT INTO ROLES (NAME) VALUES ('CLIENT');
    `;
    const users = `
        CREATE TABLE USERS (
        CI VARCHAR(50) PRIMARY KEY,
        EMAIL VARCHAR(50) NOT NULL UNIQUE,
        PASSWORD VARCHAR(60) NOT NULL,
        NOMBRE VARCHAR(50) NOT NULL,
        ROLE_ID INT NOT NULL DEFAULT 3,
        FOREIGN KEY (ROLE_ID) REFERENCES ROLES(RID)
        );
    `;
    
    const bebe = `
        CREATE TABLE BEBE (
        id SERIAL PRIMARY KEY,
        NOMBRE VARCHAR(50) NOT NULL UNIQUE,
        FECHA_NACIMIENTO DATE NOT NULL,
        GENERO VARCHAR(50) NOT NULL,
        CI_USUARIO VARCHAR(50) NOT NULL,
        FOREIGN KEY (CI_USUARIO) REFERENCES USERS(CI) ON UPDATE CASCADE
        );
    `;
    const esquema_vacunacion = `
        CREATE TABLE esquema_vacunacion (
        id SERIAL PRIMARY KEY,
        id_bebe INTEGER NOT NULL,
        id_vacuna INTEGER NOT NULL,
        fecha_programada DATE NOT NULL,
        aplicada VARCHAR(20) default 'pendiente' NOT NULL,
        FOREIGN KEY (id_bebe) REFERENCES bebe(id) ON DELETE CASCADE,
        FOREIGN KEY (id_vacuna) REFERENCES vacunas(id)
        );
    `;
    
    const vacunas = `
        CREATE TABLE vacunas (
        id SERIAL PRIMARY KEY,
        nombre_vacuna VARCHAR(255) NOT NULL,
        dias_desde_nacimiento INTEGER NOT NULL,
        mes_aplicacion VARCHAR(50) NOT NULL
        );
    `;
    const insertVacunas = `
       INSERT INTO vacunas (nombre_vacuna, dias_desde_nacimiento, mes_aplicacion)
        VALUES 
        -- BCG
        ('BCG', 0, 'dias'),

        -- Pentavalente
        ('Pentavalente 1', 60, 'dias'),
        ('Pentavalente 2', 120, 'dias'),
        ('Pentavalente 3', 180, 'dias'),
        ('Pentavalente 4', 540, 'dias'),
        ('Pentavalente 5', 1460, 'dias'),

        -- Anti polio
        ('Anti polio 1', 60, 'dias'),
        ('Anti polio 2', 120, 'dias'),
        ('Anti polio 3', 180, 'dias'),
        ('Anti polio 4', 540, 'dias'),

        -- Anti neumocócica
        ('Anti neumocócica 1', 60, 'dias'),
        ('Anti neumocócica 2', 120, 'dias'),
        ('Anti neumocócica 3', 180, 'dias'),

        -- Anti rotavirus
        ('Anti rotavirus 1', 60, 'dias'),
        ('Anti rotavirus 2', 120, 'dias'),

        -- Anti influenza pediátrica
        ('Anti influenza pediátrica 1', 180, 'dias'),
        ('Anti influenza pediátrica 2', 210, 'dias'),
        ('Anti influenza pediátrica 3', 360, 'dias'),

        -- SRP
        ('SRP', 360, 'dias'),

        -- Anti amarílica
        ('Anti amarílica', 360, 'dias'),

        -- VPH
        ('Virus del Papiloma Humano (VPH) 1', 3650, 'dias'),
        ('Virus del Papiloma Humano (VPH) 2', 3830, 'dias'),

        -- dT adulto
        ('dT adulto 1', 2555, 'dias'),
        ('dT adulto 2', 2655, 'dias'),

        -- Anti influenza estacional adulto
        ('Anti influenza estacional adulto', 21915, 'dias');

    `;
    const recordatorio_medicamento = `
        CREATE TABLE recordatorio_medicamento (
        id_recordatorio SERIAL PRIMARY KEY,  -- ID único para cada recordatorio
        nombre_medicamento VARCHAR(100) NOT NULL,  -- Nombre del medicamento
        hora TIME NOT NULL,  -- Hora de la administración (se puede ajustar más tarde para múltiples horarios)
        fecha_inicio DATE NOT NULL,  -- Fecha de inicio del recordatorio
        fecha_fin DATE NOT NULL,  -- Fecha de fin del recordatorio
        cantidad DECIMAL(5, 2) NOT NULL,  -- Cantidad del medicamento a administrar
        tipo VARCHAR(40) NOT NULL,
        unidad VARCHAR(20),  -- Unidad de medida (ml, tableta, etc.)
        frecuencia INT NOT NULL,  -- Frecuencia diaria (1 vez, 2 veces, etc.)
        id_bebe INTEGER NOT NULL,  -- ID del bebe que recibe el medicamento
        FOREIGN KEY (id_bebe) REFERENCES bebe(id)  -- Asumiendo que existe una tabla de usuarios
        );
    `;
    const recomendaciones = `
        CREATE TABLE recomendaciones (
        id SERIAL PRIMARY KEY,
        nombre_interpretador VARCHAR(100) NOT NULL,  -- Nombre del medicamento
        titulo VARCHAR(100) NOT NULL
        );
    `;
    
    const insertRecomendaciones =`
    INSERT INTO recomendaciones (nombre_interpretador, titulo)
    VALUES ('Dolor de Vientre','Si tu bebé tiene dolor de vientre, puedes intentar lo siguiente:'),
            ('Eructar','Si tu bebé tiene Eructos, puedes intentar lo siguiente:'),
            ('Fatigado','Si tu bebé esta Fatigado, puedes intentar lo siguiente:'),
            ('Hambriento','Si tu bebé tiene Hambre, puedes intentar lo siguiente:'),
            ('Malestar','Si tu bebé tiene Malestar, puedes intentar lo siguiente:'),
    
    `;
    const soluciones = `
        CREATE TABLE soluciones (
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        id_recomendacion INTEGER NOT NULL, 
        FOREIGN KEY (id_recomendacion) REFERENCES recomendaciones(id)  
        );
    `;
    const insertSoluciones =`
    INSERT INTO soluciones (nombre, id_recomendacion)
    VALUES ('Masaje abdominal: Realiza movimientos circulares suaves en el abdomen en el sentido de las agujas del reloj.', 1),
    ('Ejercicio de bicicleta: Mueve sus piernas suavemente como si pedaleara.', 1),
    ('Colocar boca abajo: Pon al bebé boca abajo sobre tus piernas y frota su espalda.', 1),
    ('Calor suave: Aplica una toalla tibia (no caliente) sobre el abdomen.', 1),
    ('Baño tibio: Sumérgelo en agua tibia para relajar sus músculos.', 1),
    ('Llevarlo a pasear: Mecerlo suavemente mientras caminas puede calmarlo.', 1),
    ('Probar probióticos (si lo recomienda el pediatra): Algunos bebés se benefician de probióticos para aliviar problemas digestivos.',1),
    ('Cambiar la posición al alimentarlo: Sostén al bebé en un ángulo mayor para evitar que trague aire.', 1),
        
    ('Mantener al bebé erguido: Sostenlo en posición vertical después de comer y da palmaditas suaves en la espalda.', 2),
    ('Cambiar de posición: Intenta posiciones como colocarlo sobre tu hombro o sentado en tus piernas mientras lo sostienes.', 2),
    ('Hacer pausas al alimentar: Detente cada pocos minutos para que pueda eructar antes de seguir comiendo.', 2),
    ('Usar movimientos suaves: Mecerlo de forma vertical mientras intentas que eructe.', 2),
    ('Evitar sobrealimentación: Alimentar al bebé en porciones más pequeñas y frecuentes puede reducir los gases.', 2),
    ('Revisar la técnica de lactancia: Asegúrate de que se enganche correctamente para evitar tragar aire.', 2),

    ('Crear un ambiente tranquilo: Reduce el ruido y las luces brillantes.', 3),
    ('Mecer suavemente: Usa movimientos rítmicos para ayudar al bebé a relajarse.', 3),
    ('Rutina de sueño: Establece una rutina consistente para acostarlo.', 3),
    ('Contacto piel con piel: Sostén al bebé cerca de tu pecho para reconfortarlo.', 3),
    ('Ruido blanco: Usar sonidos suaves o un dispositivo de ruido blanco para ayudarlo a relajarse.', 3),
    ('Pasear en cochecito: Dar un paseo suave en cochecito o auto puede calmarlo.', 3),
    ('Ambiente cómodo: Asegúrate de que la habitación esté a una temperatura adecuada y sea acogedora.', 3),

    ('Alimentarlo de inmediato: Dale leche materna o fórmula según lo necesite.', 4),
    ('Establecer horarios regulares: Asegúrate de que esté alimentándose con la frecuencia adecuada.', 4),
    ('Reconocer señales de hambre: Observa si busca el pecho, chupa sus manos o hace movimientos de succión.', 4),
    ('Ofrecerle más cantidad: Si está creciendo o en un periodo de desarrollo, podría necesitar alimentarse más.', 4),
    ('Revisar la calidad de la leche (en lactancia): Si amamantas, consulta al pediatra si necesitas ajustar tu dieta.', 4),
    ('Alimentación con calma: Reduce distracciones para que el bebé pueda concentrarse en comer.', 4),

    ('Verificar pañal: Cambia el pañal si está sucio o mojado.', 5),
    ('Revisar la ropa: Asegúrate de que no esté demasiado ajustada o incómoda.', 5),
    ('Calmar con contacto: Proporciona contacto piel con piel o acaricia al bebé.', 5),
    ('Observar patrones: Anota si el malestar ocurre después de comer o en ciertos momentos.', 5),
    ('Comprobar la temperatura corporal: Asegúrate de que no esté demasiado caliente o frío.', 5),
    ('Usar un chupete: Algunos bebés se calman con la succión no nutritiva.', 5),
    ('Cargarlo en un portabebés: Esto puede proporcionarle seguridad y calidez.', 5),
    ('Observar signos de enfermedad: Como fiebre, sarpullido o vómitos, y actuar rápidamente si están presentes.', 5),
    ('Consultar al pediatra: Si el malestar persiste o hay otros síntomas graves, busca orientación médica.', 5),
    `;
    const datos=`
        CREATE TABLE datos (
        id SERIAL PRIMARY KEY,
        nombre_interpretador VARCHAR(50) NOT NULL,
        fecha DATE NOT NULL,
        contador INT NOT NULL,
        id_bebe INT NOT NULL,
        FOREIGN KEY (id_bebe) REFERENCES BEBE(id)
        );
    `;
    const createTriggerDatos = `
        CREATE OR REPLACE FUNCTION incrementar_o_insertar()
        RETURNS TRIGGER AS $$
        BEGIN
            -- Verificar si ya existe un registro con la misma fecha, nombre_interpretador e id_bebe
            IF EXISTS (
                SELECT 1 
                FROM datos 
                WHERE id_bebe = NEW.id_bebe 
                AND nombre_interpretador = NEW.nombre_interpretador 
                AND fecha = NEW.fecha
            ) THEN
                -- Si existe, incrementar el contador
                UPDATE datos
                SET contador = contador + 1
                WHERE id_bebe = NEW.id_bebe 
                AND nombre_interpretador = NEW.nombre_interpretador 
                AND fecha = NEW.fecha;

                -- Prevenir la inserción
                RETURN NULL;
            ELSE
                -- Si no existe, permitir la inserción
                RETURN NEW;
            END IF;
        END;
        $$ LANGUAGE plpgsql;
        CREATE TRIGGER trigger_incrementar_o_insertar
        BEFORE INSERT ON datos
        FOR EACH ROW
        EXECUTE FUNCTION incrementar_o_insertar();
    `;

    const chat = `
        CREATE TABLE chat (
        id SERIAL PRIMARY KEY,
        fecha DATE NOT NULL,
        descripcion TEXT NOT NULL,
        CI_USUARIO VARCHAR(50) NOT NULL,
        FOREIGN KEY (CI_USUARIO) REFERENCES USERS(CI)
        );
    `;


    try {
            // Crear tabla de roles
    await db.query(roles);
    console.log('Table "roles" created successfully.');

    // Insertar datos iniciales en roles
    await db.query(insertRoles);
    console.log('Initial insertRoles inserted successfully.');

    // Crear tabla de usuarios
    await db.query(users);
    console.log('Table "users" created successfully.');

    // Crear tabla de bebés
    await db.query(bebe);
    console.log('Table "bebe" created successfully.');

    // Crear tabla de esquema de vacunación
    await db.query(esquema_vacunacion);
    console.log('Table "esquema_vacunacion" created successfully.');

    // Crear tabla de vacunas
    await db.query(vacunas);
    console.log('Table "vacunas" created successfully.');

    // Insertar datos iniciales en vacunas
    await db.query(insertVacunas);
    console.log('Initial insertVacunas inserted successfully.');

    // Crear tabla de recordatorio de medicamentos
    await db.query(recordatorio_medicamento);
    console.log('Table "recordatorio_medicamento" created successfully.');

    // Crear tabla de recomendaciones
    await db.query(recomendaciones);
    console.log('Table "recomendaciones" created successfully.');

    // Insertar datos iniciales en recomendaciones
    await db.query(insertRecomendaciones);
    console.log('Initial insertRecomendaciones inserted successfully.');

    // Crear tabla de soluciones
    await db.query(soluciones);
    console.log('Table "soluciones" created successfully.');

    // Insertar datos iniciales en soluciones
    await db.query(insertSoluciones);
    console.log('Initial insertSoluciones inserted successfully.');

    // Crear tabla de datos
    await db.query(datos);
    console.log('Table "datos" created successfully.');

    // Crear trigger para tabla de datos
    await db.query(createTriggerDatos);
    console.log('Trigger "createTriggerDatos" created successfully.');

    // Crear tabla de chat
    await db.query(chat);
    console.log('Table "chat" created successfully.');

        
    } catch (err) {
        console.error('Error during database setup:', err);
        process.exit(1); // Exits the process with a failure code
    } finally {
        db.end(); // Cierra la conexión a la base de datos
    }
};

createTables();
