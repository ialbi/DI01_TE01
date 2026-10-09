# DI01_TE01 - Restaurantes

Práctica de la asignatura **Desarrollo de Interfaces** de 2.º de DAM.

Hemos partido de la plantilla proporcionada por el profesor y hemos completado el código para que la aplicación funcione según lo que se pide en el ejercicio.

## ¿Qué hace la aplicación?

La aplicación carga una lista de restaurantes desde un archivo JSON y los muestra en una tabla.

Una vez cargados los datos, podemos:

- Buscar restaurantes por su nombre.
- Filtrar por territorio (Araba, Bizkaia o Gipuzkoa).
- Seleccionar una o varias localidades.
- Combinar los filtros para encontrar restaurantes.
- Ver cuántos restaurantes se están mostrando.

Al pulsar el botón de cargar datos, aparece un mensaje indicando cuántos restaurantes se han cargado.

## ¿Qué hemos utilizado?

- **Ionic:** para los botones, campos de búsqueda y selectores.
- **Angular y TypeScript:** para gestionar los datos y hacer funcionar los filtros.
- **HTML y SCSS:** para la interfaz.
- **JSON:** para obtener los datos de los restaurantes.

También hemos trabajado con `signal()`, `computed()`, `filter()` y `map()`, entre otros.

## ¿Cómo se ejecuta?

Primero instalamos las dependencias:

```bash
npm install
```

Después iniciamos la aplicación:

```bash
ionic serve
```

La aplicación se abrirá en el navegador.

## Plantilla original

El ejercicio se ha realizado a partir de la plantilla del profesor:

https://github.com/di-birt/DI01_TE01_Plantilla_2627

Hemos completado los apartados pendientes para conseguir el funcionamiento solicitado.
