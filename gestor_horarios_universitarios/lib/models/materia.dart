class Materia {
  String id;
  String nombre;
  String dia;
  String horaInicio;
  String horaFin;

  Materia({required this.id, required this.nombre, required this.dia, required this.horaInicio, required this.horaFin});

  // Convertir un objeto Materia a un mapa para MongoDB
  Map<String, dynamic> toMap() {
    return {
      'nombre': nombre,
      'dia': dia,
      'horaInicio': horaInicio,
      'horaFin': horaFin,
    };
  }

  // Crear un objeto Materia desde un mapa obtenido de MongoDB
  factory Materia.fromMap(Map<String, dynamic> map) {
    return Materia(
      id: map['_id'].toString(),
      nombre: map['nombre'],
      dia: map['dia'],
      horaInicio: map['horaInicio'],
      horaFin: map['horaFin'],
    );
  }
}
