import 'package:flutter/material.dart';
import 'screens/materias_screen.dart'; // Asegúrate de que la ruta es correcta según la estructura de tu proyecto

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Gestor de Horarios Universitarios',
      theme: ThemeData(
        // Define the primary color of your app (among other settings like text themes).
        primarySwatch: Colors.blue,
      ),
      home: MateriasScreen(), // Set MateriasScreen as the home screen
    );
  }
}
