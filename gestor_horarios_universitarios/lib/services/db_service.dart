import 'package:mongo_dart/mongo_dart.dart' show Db, DbCollection, where, ObjectId;
import '../models/materia.dart';

class DatabaseService {
  // Instancia de Db para conectarse a MongoDB y una referencia a la colección 'materias'.
  Db db = Db('mongodb://practicas-proyiii-shard-00-00.jf3gi.mongodb.net:27017');
  late DbCollection collection;

  DatabaseService() {
    // Inicializa la colección 'materias' al crear el servicio.
    collection = db.collection('materias');
  }

  // Obtiene todas las materias de la base de datos, retorna una lista de objetos Materia.
  Future<List<Materia>> getMaterias() async {
    await db.open();  // Abre la conexión a la base de datos.
    List<Map<String, dynamic>> materiasList = await collection.find().toList();  // Consulta todas las materias.
    await db.close();  // Cierra la conexión a la base de datos.
    return materiasList.map((materia) => Materia.fromMap(materia)).toList();  // Convierte los mapas a objetos Materia.
  }

  // Añade una nueva materia a la base de datos.
  Future<void> addMateria(Materia materia) async {
    await db.open();  // Abre la conexión a la base de datos.
    await collection.insert(materia.toMap());  // Inserta la nueva materia.
    await db.close();  // Cierra la conexión a la base de datos.
  }

  // Actualiza una materia existente identificada por su id.
  Future<void> updateMateria(Materia materia) async {
    await db.open();  // Abre la conexión a la base de datos.
    var query = where.id(ObjectId.fromHexString(materia.id));  // Crea un query por id.
    await collection.update(query, materia.toMap());  // Actualiza la materia.
    await db.close();  // Cierra la conexión a la base de datos.
  }

  // Elimina una materia de la base de datos usando su id.
  Future<void> deleteMateria(String id) async {
    await db.open();  // Abre la conexión a la base de datos.
    await collection.remove(where.id(ObjectId.fromHexString(id)));  // Elimina la materia por id.
    await db.close();  // Cierra la conexión a la base de datos.
  }
}
