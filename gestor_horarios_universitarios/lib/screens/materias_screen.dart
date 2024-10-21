import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:gestor_horarios_universitarios/models/materia.dart';  
import 'package:gestor_horarios_universitarios/services/db_service.dart';

// Define el widget StatefulWidget que maneja el estado del calendario y la lista de materias.
class MateriasScreen extends StatefulWidget {
  const MateriasScreen({super.key});

  @override
  _MateriasScreenState createState() => _MateriasScreenState();
}

// Estado del widget que carga y muestra las materias en un calendario.
class _MateriasScreenState extends State<MateriasScreen> {
  // Lista para almacenar las materias obtenidas de la base de datos.
  List<Materia> _materias = [];
  // Formato actual del calendario (mes, dos semanas, semana).
  CalendarFormat _calendarFormat = CalendarFormat.month;
  // Día actualmente enfocado en el calendario.
  DateTime _focusedDay = DateTime.now();
  // Día seleccionado por el usuario.
  DateTime? _selectedDay;
  // Mapa de eventos donde cada día clave tiene asociada una lista de materias.
  Map<DateTime, List<Materia>> _events = {};
  // Servicio para interactuar con la base de datos.
  DatabaseService dbService = DatabaseService();

  @override
  void initState() {
    super.initState();
    _loadMaterias();  // Cargar las materias al iniciar el widget.
  }

  // Carga las materias desde la base de datos y construye la lista de eventos.
  void _loadMaterias() async {
    var materias = await dbService.getMaterias();
    setState(() {
      _materias = materias;
      _buildEventList();
    });
  }

  // Construye el mapa de eventos basado en las materias cargadas.
  void _buildEventList() {
    _events = {};
    for (var materia in _materias) {
      DateTime day = DateTime.parse(materia.dia);
      if (!_events.containsKey(day)) {
        _events[day] = [];
      }
      _events[day]?.add(materia);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Calendario de Materias")),
      body: Column(
        children: [
          TableCalendar<Materia>(
            firstDay: DateTime.utc(2020, 10, 16),
            lastDay: DateTime.utc(2030, 3, 14),
            focusedDay: _focusedDay,
            selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
            eventLoader: (day) => _events[day] ?? [],
            onDaySelected: (selectedDay, focusedDay) {
              setState(() {
                _selectedDay = selectedDay;
                _focusedDay = focusedDay;  // Actualiza los días seleccionado y enfocado.
              });
            },
            calendarFormat: _calendarFormat,
            onFormatChanged: (format) {
              if (_calendarFormat != format) {
                setState(() {
                  _calendarFormat = format;  // Permite cambiar el formato del calendario.
                });
              }
            },
            onPageChanged: (focusedDay) {
              _focusedDay = focusedDay;  // Cambia el día enfocado cuando se cambia la página.
            },
          ),
          Expanded(child: _buildEventListWidget()),  // Muestra los eventos del día seleccionado.
        ],
      ),
    );
  }

  // Construye una lista de widgets para mostrar eventos para el día seleccionado.
  Widget _buildEventListWidget() {
    return ListView(
      children: _events[_selectedDay ?? _focusedDay]?.map((materia) => ListTile(
        title: Text(materia.nombre),
        subtitle: Text('${materia.horaInicio} - ${materia.horaFin}'),
      )).toList() ?? [const Center(child: Text("No hay eventos"))],
    );
  }
}
