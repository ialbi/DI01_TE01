import { Component, signal, computed, inject } from '@angular/core';
import restaurantesJSON from '../../assets/datos/restaurantes.json';
import { IonicModule, ToastController } from '@ionic/angular';
import { Restaurante } from '../interface/restaurante';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule],
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  // Inyectamos el controlador de Ionic para crear los mensajes toast.
  private readonly toastController = inject(ToastController);

  // El JSON está disponible, pero la tabla empieza sin datos cargados.
  restaurantes: Restaurante[] = restaurantesJSON as Restaurante[];
  // El signal empieza vacío y recibe los restaurantes al pulsar Cargar datos.
  restaurantesCargados = signal<Restaurante[]>([]);
  // computed comprueba si hay datos y se actualiza automáticamente para habilitar los filtros.
  hayDatos = computed(() => this.restaurantesCargados().length > 0);

  // set guarda la lista del JSON en el signal y después mostramos el total en un toast.
  async cargarDatos() {
    this.restaurantesCargados.set(this.restaurantes);
    await this.mostrarToast(`${this.restaurantesCargados().length} restaurantes cargados`, 'success');
  }

  // Creamos un aviso con el mensaje y color recibidos, visible abajo durante 2,5 segundos.
  private async mostrarToast(mensaje: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message: mensaje,
      color,
      duration: 2500,
      position: 'bottom'
    });
    // present muestra el toast que acabamos de crear.
    await toast.present();
  }

  // Los signals guardan los filtros. Un valor vacío significa que ese filtro no se aplica.
  textoBusqueda = signal('');
  territorioSeleccionado = signal('');
  // Usamos un array porque se pueden seleccionar varias localidades.
  localidadesSeleccionadas = signal<string[]>([]);

  // Calculamos las opciones de territorio a partir de los restaurantes cargados.
  territoriosFiltrados = computed(() => {
    // map recoge los territorios, trim quita espacios y filter(Boolean) descarta los vacíos.
    const territorios = this.restaurantesCargados()
      .map(r => r.territory.trim()).filter(Boolean);
    // Set elimina duplicados; Array.from lo convierte en array y sort lo ordena.
    return Array.from(new Set(territorios)).sort();
  });

  // Actualizamos el territorio y conservamos solo las localidades seleccionadas que pertenecen a él.
  onTerritorioChange(value: string) {
    this.territorioSeleccionado.set(value ?? '');
    const localidadesValidas = this.localidadesFiltradasPorTerritorio();
    this.localidadesSeleccionadas.update(localidades =>
      localidades.filter(localidad => localidadesValidas.includes(localidad))
    );
  }

  // Recalculamos las localidades cuando cambian los datos o el territorio seleccionado.
  localidadesFiltradasPorTerritorio = computed(() => {
    let lista = this.restaurantesCargados();
    // Pasamos a minúsculas y quitamos espacios exteriores para comparar los territorios.
    const territorio = this.territorioSeleccionado().toLowerCase().trim();
    // Si no se ha elegido territorio, usamos todos los restaurantes.
    if (territorio) {
      lista = lista.filter(r => r.territory.toLowerCase().trim() === territorio);
    }
    // Descartamos localidades vacías y recogemos sus nombres sin espacios sobrantes.
    const localidades = lista.filter(r => !!r.locality?.trim()).map(r => r.locality.trim());
    // Devolvemos las localidades sin repetir y ordenadas alfabéticamente.
    return Array.from(new Set(localidades)).sort();
  });

  // Guardamos las localidades del evento; si no hay valor, usamos un array vacío.
  onLocalidadesChange(value: string[]) {
    this.localidadesSeleccionadas.set(value ?? []);
  }

  // Los tres filtros se combinan; basta cambiar un signal para recalcular la tabla.
  restaurantesFiltrados = computed(() => {
    // Normalizamos la búsqueda para ignorar mayúsculas y espacios exteriores.
    const texto = this.textoBusqueda().toLowerCase().trim();
    const territorio = this.territorioSeleccionado().toLowerCase().trim();
    const localidades = this.localidadesSeleccionadas();
    // Cada condición acepta un filtro vacío o una coincidencia. && combina los tres filtros.
    return this.restaurantesCargados().filter(r =>
      (!texto || r.documentName.toLowerCase().includes(texto)) &&
      (!territorio || r.territory.toLowerCase().trim() === territorio) &&
      // includes comprueba si el restaurante pertenece a alguna de las localidades elegidas.
      (!localidades.length || localidades.includes(r.locality?.trim()))
    );
  });

  // Comprobamos si hay algún filtro para mostrar la sugerencia cuando no hay resultados.
  hayFiltrosActivos = computed(() =>
    !!this.textoBusqueda().trim() || !!this.territorioSeleccionado() ||
    this.localidadesSeleccionadas().length > 0
  );

  // Vaciamos los tres filtros para volver a mostrar todos los restaurantes cargados.
  limpiarTodosFiltros() {
    this.textoBusqueda.set('');
    this.territorioSeleccionado.set('');
    this.localidadesSeleccionadas.set([]);
  }

  // Convertimos las estrellas a número; si no es válido o positivo, devolvemos 0.
  estrellasMichelin(restaurante: Restaurante): number {
    const estrellas = Number(restaurante.michelinStar);
    return Number.isFinite(estrellas) && estrellas > 0 ? estrellas : 0;
  }

  // Convertimos los soles Repsol a número; si no es válido o positivo, devolvemos 0.
  repsolSoles(restaurante: Restaurante): number {
    const soles = Number(restaurante.repsolSun);
    return Number.isFinite(soles) && soles > 0 ? soles : 0;
  }
}
