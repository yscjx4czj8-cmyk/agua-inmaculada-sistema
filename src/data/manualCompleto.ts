import type { CapituloManual } from '../types';

/**
 * Manual Completo de Operación y Mantenimiento
 * Smart Vending - Agua Inmaculada
 * Extraído del PDF oficial (33 páginas)
 */

export const manualCompleto: CapituloManual[] = [
  {
    id: '1',
    titulo: 'Presurizador Automático',
    pagina: 5,
    contenido: 'Este equipo trabaja a base de presión, al disminuirla provoca que el presurizador encienda de manera automática. Al recuperar la presión máxima requerida para su funcionamiento, se apaga el equipo.',
    imagenes: ['Imagen de presurizador automático azul con panel de control'],
    tags: ['presurizador', 'bomba', 'presion', 'automatico'],
    importante: 'Al llenar un garrafón la presión disminuye y el presurizador enciende, al terminar el llenado del garrafón y cerrando la válvula de llenado, la presión aumenta y el presurizador se detiene.',
  },
  {
    id: '2',
    titulo: 'Filtro Dual (Arena y Carbón)',
    pagina: 5,
    contenido: 'Los dos contenidos en el mismo filtro.',
    subsecciones: [
      {
        titulo: 'Arena',
        contenido: 'Ayuda a retener sólidos en suspensión (basura que pueda tener el agua) mayores o iguales a 25 micras (ej. cabello humano).',
      },
      {
        titulo: 'Carbón activado',
        contenido: 'El filtro de carbón es un elemento de adsorción que sirve para atrapar el cloro, color, olor y sabor del agua, ayuda a mejorar las características organolépticas del agua.',
      },
    ],
    imagenes: [
      'Filtro azul con arena en la parte inferior',
      'Filtros de carbón activado de diferentes formas',
      'Tanque de filtro azul completo',
    ],
    tags: ['filtro', 'dual', 'arena', 'carbon', 'filtracion'],
  },
  {
    id: '3',
    titulo: 'Medición de Cloro y pH',
    pagina: 6,
    contenido: 'Pasos para la toma de muestra y medición de parámetros de calidad del agua.',
    pasos: [
      {
        numero: 1,
        descripcion: 'Abra la válvula de muestreo del filtro de carbón y deje pasar agua durante 30 segundos. Posteriormente, agregue agua hasta la línea de aforo en ambos contenedores.',
        imagen: 'Kit de medición con recipientes amarillos y rojos, y escala de colores',
      },
      {
        numero: 2,
        descripcion: 'Agregue cuatro gotas de la solución amarilla en el depósito de color amarillo y cuatro gotas de solución roja en el depósito de color rojo.',
        imagen: 'Recipientes con soluciones amarilla y roja siendo agregadas',
      },
      {
        numero: 3,
        descripcion: 'Tape los frascos con el tapón de color correspondiente y agite vigorosamente hasta lograr homogeneizar.',
        imagen: 'Frascos tapados listos para agitar',
      },
      {
        numero: 4,
        descripcion: 'Después de unos segundos, revise la tonalidad y compárela con la escala de color de cada extremo y determine el resultado del muestreo.',
        imagen: 'Frasco amarillo y morado comparándose con escalas de colores',
      },
      {
        numero: 5,
        descripcion: 'Verifique que el nivel de cloro del agua extraída de la espiga de llenado sea igual a cero, de lo contrario, realice un retrolavado al filtro de carbón.',
        advertencia: 'Si la lectura es mayor a 0 en la muestra del área de llenado, realice retrolavado al filtro Dual. En caso de obtener la misma lectura, proceda a remplazar la carga de arena y carbón activado. Realice la prueba cada que se llene el tanque de almacenamiento y después del paso del agua por el filtro Dual.',
      },
    ],
    tags: ['medicion', 'cloro', 'ph', 'calidad', 'pruebas'],
    frecuencia: 'Semanal',
    importante: 'VERIFIQUE: Si la lectura es mayor a 0 en la muestra del área de llenado, realice retrolavado al filtro Dual.',
  },
  {
    id: '4',
    titulo: 'Retrolavado de Filtro Dual (Arena y Carbón)',
    pagina: 7,
    contenido: 'El filtro cuenta con una palanca en la parte superior del cabezal. Para llevar a cabo el retrolavado y expulsar las partículas que los filtros han retenido en el proceso de purificación del agua, continue con los siguientes pasos:',
    frecuencia: 'Una vez a la semana y recién instalada la planta.',
    pasos: [
      {
        numero: 1,
        descripcion: 'Gire la palanca a la posición "Back Wash", y permanezca en esta posición por 5 minutos. En este paso, el medio filtrante es lavado a la inversa y se desechan los sólidos retenidos entre los gránulos del medio.',
        imagen: 'Palanca del filtro en posición Back Wash',
      },
      {
        numero: 2,
        descripcion: 'Gire la palanca a la posición "Fast Rinse" y permanezca en esta posición por 1 minuto. En este paso se realiza el enjuague del medio filtrante las partículas contenidas son expulsadas por el tubo de drenaje.',
        imagen: 'Palanca del filtro en posición Fast Rinse',
      },
      {
        numero: 3,
        descripcion: 'Regrese la palanca a la posición inicial "Filter".',
        imagen: 'Palanca del filtro en posición Filter',
      },
    ],
    tags: ['retrolavado', 'filtro', 'dual', 'mantenimiento', 'limpieza'],
    importante: 'Cuando realice un cambio de medios filtrantes, repita el proceso de retrolavado las veces que sean necesarias hasta que el agua que sale en la espiga de muestreo del filtro dual no presente finas partículas de carbón y esté completamente cristalina.',
  },
  {
    id: '5',
    titulo: 'Cambio de Medios Filtrantes (Dual y Resina)',
    pagina: 8,
    contenido: 'Pasos a seguir para el reemplazo de medios filtrantes.',
    frecuencia: 'Se recomienda 1 vez al año, dependiendo de la calidad de su agua cruda.',
    pasos: [
      {
        numero: 1,
        descripcion: 'Despresurice la línea desconectando la bomba de la corriente eléctrica y gire la palanca del filtro dual a la posición "Fast Rinse". Posteriormente, cierre la válvula del tanque de agua cruda.',
        imagen: 'Filtro con tuercas unión marcadas',
      },
      {
        numero: 2,
        descripcion: 'Desenrosque las tuercas unión de su filtro.',
        imagen: 'Tuercas unión siendo desenroscadas',
      },
      {
        numero: 3,
        descripcion: 'Desenrosque el cabezal del filtro, girando en contra de las manecillas del reloj.',
        imagen: 'Cabezal del filtro siendo desenroscado',
      },
      {
        numero: 4,
        descripcion: 'Incline el filtro hasta colocarlo en posición horizontal.',
        imagen: 'Filtro inclinado horizontalmente',
      },
      {
        numero: 5,
        descripcion: 'Con el filtro en posición horizontal, retire el tubo con difusor.',
        imagen: 'Tubo con difusor extraído del filtro',
      },
      {
        numero: 6,
        descripcion: 'Ya retirado el medio filtrante, regréselo a su posición normal.',
      },
      {
        numero: 7,
        descripcion: 'Enjuague el tubo con el difusor y el interior del filtro con agua.',
      },
      {
        numero: 8,
        descripcion: 'Introduzca el extremo del difusor al tanque.',
      },
      {
        numero: 9,
        descripcion: 'Coloque un embudo en la boquilla del filtro y vierta el contenido de la nueva carga.',
        imagen: 'Embudo colocado vertiendo contenido',
        advertencia: 'Cuide que el medio filtrante no entre en el tubo difusor ya que puede dañar el cabezal.',
      },
      {
        numero: 10,
        descripcion: 'Coloque nuevamente el cabezal y enrosque las tuercas unión.',
        imagen: 'Cabezal siendo colocado nuevamente',
      },
    ],
    tags: ['cambio', 'medios', 'filtrantes', 'arena', 'carbon', 'resina'],
    importante: 'Al finalizar el cambio de medios filtrantes es necesario que realice la limpieza (retrolavado) hasta que el agua que sale de las válvulas de muestreo del filtro dual esté cristalina.',
  },
  {
    id: '6',
    titulo: 'Filtro Pulidor',
    pagina: 10,
    contenido: 'La función de este filtro es retener las impurezas diminutas, sólidos de 1 a 5 micras. Posterior a este paso, el agua se considera brillante y cristalina.',
    imagenes: ['Filtro pulidor cilíndrico blanco'],
    tags: ['filtro', 'pulidor', 'micras', 'cristalino'],
  },
  {
    id: '7',
    titulo: 'Limpieza de Filtros Pulidores',
    pagina: 10,
    contenido: 'Para realizar la limpieza correctamente es necesario despresurizar la línea, para ello realice lo siguiente:',
    frecuencia: 'Una vez a la semana.',
    pasos: [
      {
        numero: 1,
        descripcion: 'Desconecte la bomba principal y abra la válvula de muestra de dureza.',
        imagen: 'Válvula de muestreo y muestra de dureza señaladas',
      },
      {
        numero: 2,
        descripcion: 'Coloque una cubeta por debajo del filtro pulidor para evitar que el agua se derrame.',
        imagen: 'Filtro con cubeta debajo',
      },
      {
        numero: 3,
        descripcion: 'Introduzca la llave en forma de raqueta por debajo del portafiltro hasta la parte superior de este y gire como se indica en la imagen.',
        imagen: 'Llave de raqueta girando el filtro',
      },
      {
        numero: 4,
        descripcion: 'Sostenga el filtro colocando una mano en la base a manera de apoyo, ya que debido al peso puede resbalarse, caer y dañarse.',
        imagen: 'Mano sosteniendo la base del filtro',
      },
      {
        numero: 5,
        descripcion: 'Retire el empaque que contiene la carcasa y asegúrese de no perderlo. ¡¡¡Si no se coloca, provoca una fuga!!!',
        imagen: 'Empaque siendo retirado',
        advertencia: 'Si no se coloca, provoca una fuga',
      },
      {
        numero: 6,
        descripcion: 'Una vez retirada la carcasa, tome con mucho cuidado el filtro que se encuentra en el interior y deposítelo en un recipiente con agua purificada cubriendo todo el filtro.',
        imagen: 'Filtro depositado en recipiente',
      },
      {
        numero: 7,
        descripcion: 'Agregue 20 gotas de cloro y deje el filtro sumergido dentro del agua un tiempo de 15 a 20 min. Durante ese tiempo, voltee el filtro para desinfectarlo correctamente.',
        imagen: 'Cartuche pulidor en cubeta con cloro',
      },
      {
        numero: 8,
        descripcion: 'Enjuague con abundante agua purificada.',
      },
      {
        numero: 9,
        descripcion: 'Lubrique con glicerina o vaselina los empaques. Coloque los filtros en las carcasas previamente enjuagadas y enrosque los empaques evitando apretar demasiado, ya que la presión de cierre y la presión del agua evitará que posteriormente se puedan retirar.',
      },
    ],
    tags: ['limpieza', 'filtros', 'pulidores', 'mantenimiento'],
  },
  {
    id: '8',
    titulo: 'Filtro Suavizador',
    pagina: 12,
    contenido: 'Este filtro reduce los niveles de dureza₁ (calcio y magnesio) del agua a niveles óptimos para consumo humano. El suavizador hace su función a través de resinas de intercambio iónico. Para esto, las resinas requieren una regeneración con sal (industrial) para recuperar su capacidad de intercambio.',
    imagenes: ['Tanque de filtro suavizador con cabezal electrónico'],
    tags: ['suavizador', 'dureza', 'resina', 'sal'],
    importante: 'La dureza es comúnmente conocida como sarro y es directamente proporcional a la concentración de sales de Calcio y Magnesio presentes en el agua.',
  },
  {
    id: '9',
    titulo: 'Regeneración del Filtro Suavizador y Lectura de Dureza',
    pagina: 12,
    contenido: 'Es importante hacer el retrolavado de la resina catiónica antes de utilizar el equipo por primera vez, ya que al ser nueva requiere un lavado inicial. La frecuencia de la regeneración depende directamente de la calidad del agua que ingresa al equipo, es decir, entre más dureza presente el agua, las regeneraciones deben hacerse con más frecuencia.',
    pasos: [
      {
        numero: 1,
        descripcion: 'Abra la válvula de muestreo del filtro suavizador y deje pasar agua durante 30 segundos.',
        imagen: 'Válvula de muestreo señalada',
      },
      {
        numero: 2,
        descripcion: 'Utilice el recipiente incluido en el kit de dureza y vierta agua de la válvula de muestra del filtro suavizador hasta la línea de aforo.',
        imagen: 'Kit de dureza con recipiente y soluciones',
      },
      {
        numero: 3,
        descripcion: 'Agregue dos gotas de la solución número 6. Si al agregarlas el agua se torna de color azul, esto indica que no tiene dureza por lo que no es necesario realizar el mantenimiento.',
        imagen: 'Solución 6 siendo agregada a recipientes',
      },
      {
        numero: 4,
        descripcion: 'Si el agua se torna de color morado o rojo indica que contiene dureza.',
        imagen: 'Comparación de agua sin dureza (azul) y con dureza (morado)',
        advertencia: 'En caso de contener dureza, agregue una gota de la solución 7 y agite la solución hasta que se mezcle perfectamente, repita hasta que la muestra cambie de color morado a color azul. Si utiliza más de una gota de la solución 7 (>50 PPM), es momento de hacer la regeneración.',
      },
    ],
    tags: ['regeneracion', 'suavizador', 'dureza', 'medicion'],
    frecuencia: 'Depende directamente de la calidad del agua cruda',
    importante: 'El filtro suavizador está conectado a un tanque de salmuera (sal + agua), el cual antes de realizar su regeneración debe contener 5 Kg de sal industrial por cada pie cúbico de resina para que se pueda realizar el intercambio iónico de manera eficiente.',
  },
  {
    id: '10',
    titulo: 'Modo de Operación Cabezal Electrónico de Filtro Suavizador',
    pagina: 15,
    contenido: 'Información sobre los parámetros del panel de control del filtro suavizador.',
    subsecciones: [
      {
        titulo: 'Programación',
        contenido: 'Para acceder al menú del equipo presione el botón de menú, enseguida enciende el icono indicando que ha accedido al menú correctamente. Presione el botón de flechas arriba o abajo para moverse dentro del menú y configurar las distintas posiciones de trabajo del equipo. Para modificar el tiempo de los parámetros de trabajo, presione el botón de menú, el tiempo comienza a parpadear. Modifique el tiempo con los botones de flecha arriba o abajo hasta obtener el tiempo deseado, presione nuevamente el botón menú para guardar el tiempo modificado.',
      },
      {
        titulo: 'Parámetros del Panel',
        contenido: `
- Hora actual
- Inicio de la regeneración: Es la hora en la cual dará inicio la regeneración
- Modo de Servicio: Días que tienen que transcurrir para realizar la siguiente regeneración
- Lavado rápido (Back Wash): Tiempo que el equipo tarda en lavar la resina retirándole el Calcio y Magnesio. Este modo de retrolavado dura 5 minutos
- Succión de Salmuera (Brine and Slow): Tiempo de succión del agua disuelta con sal (salmuera) en este modo tarda entre 35 a 45 minutos
- Recarga de salmuera (Brine and Refill): Tiempo que tarda en llenar nuevamente el tanque de salmuera, este modo tarda 30 minutos aproximadamente
- Enjuague rápido (Fast Rinse): En este paso se realiza el enjuague del medio filtrante. Este modo tarda 15 minutos aprox
- Señal de salida de modo de trabajo
        `,
      },
    ],
    imagenes: ['Panel de control digital del cabezal electrónico con iconos'],
    tags: ['cabezal', 'electronico', 'suavizador', 'programacion'],
    importante: 'Si la pantalla muestra un candado, indica que el teclado está bloqueado. Para desbloquear presiona los botones de flechas arriba y abajo al mismo tiempo por unos segundos. Una vez transcurrido el tiempo, el icono del candado desaparece, lo que significa que el teclado ha sido desbloqueado.',
  },
  {
    id: '11',
    titulo: 'Membrana para Ósmosis Inversa',
    pagina: 17,
    contenido: 'Las membranas por su estructura porosa actúan como barreras físicas que funcionan reteniendo los sólidos disueltos presentes en el agua. Este hecho permite la separación de las sustancias contaminantes del agua, generando un agua libre de sólidos disueltos (sales minerales y metales) que puedan encontrarse incluso en baja concentración.',
    imagenes: ['Diagrama de membrana de ósmosis inversa con estructura porosa', 'Membrana real'],
    tags: ['osmosis', 'membrana', 'purificacion', 'sales'],
    importante: 'Debe agregar la sal al día siguiente que se realizó la regeneración.',
  },
  {
    id: '12',
    titulo: 'Agua de Producto Final (Mezcla de SDT)',
    pagina: 17,
    contenido: 'Es importante tener en cuenta que el agua producto debe contar con una concentración de Sólidos Disueltos Totales (SDT) para la correcta hidratación del organismo, por ello, se realiza una mezcla de agua de ósmosis (Agua sin sales minerales) con agua filtrada (agua con concentración de sales minerales).',
    subsecciones: [
      {
        titulo: 'Pasos para Regular y Obtener los SDT Deseados',
        contenido: `
1. Tome agua de la válvula de muestreo.
2. Mida la cantidad de SDT.
3. Los niveles recomendados por Agua Inmaculada de SDT son de 50 a 150 Partes Por Millón (PPM).
4. Regule la válvula de mezcla hasta que en la lectura obtenga la concentración de SDT deseados.

Entre más cerrada esté la válvula menor es la cantidad de Sólidos Disueltos Totales en el agua, en caso contrario, entre más abierta este será mayor la cantidad de SDT en el agua.
        `,
      },
    ],
    imagenes: ['Válvula de mezcla', 'Tanque de agua de producto'],
    tags: ['sdt', 'mezcla', 'agua', 'producto', 'sales'],
  },
  {
    id: '13',
    titulo: 'Lectura de SDT - Sólidos Disueltos Totales',
    pagina: 18,
    contenido: 'Procedimiento para medir los sólidos disueltos totales en el agua.',
    pasos: [
      {
        numero: 1,
        descripcion: 'Tome una muestra del tanque de agua producto o de agua cruda.',
        imagen: 'Muestra de tanque de agua siendo tomada',
      },
      {
        numero: 2,
        descripcion: 'Encienda el medidor SDT con el botón superior, inmediatamente la pantalla marca ceros.',
        imagen: 'Medidor TDS digital mostrando 000',
      },
      {
        numero: 3,
        descripcion: 'Introduzca el medidor en la muestra de agua hasta el nivel indicado.',
        imagen: 'Medidor TDS siendo introducido en recipiente con agua',
      },
      {
        numero: 4,
        descripcion: 'Enseguida marca el nivel de sólidos disueltos totales en PPM (Partes Por Millón).',
        imagen: 'Medidor TDS mostrando lectura de 250 PPM',
      },
    ],
    tags: ['sdt', 'tds', 'medicion', 'solidos', 'disueltos'],
  },
  {
    id: '14',
    titulo: 'Electronivel',
    pagina: 20,
    contenido: 'Dentro del tanque de agua producto se encuentra un electronivel, este es el responsable de iniciar o pausar el proceso de purificación. Cuando el electronivel se encuentra hacia abajo (por la falta de agua) manda una señal eléctrica a la válvula solenoide y comienza a llenarse el tanque de agua producto. Cuando el electronivel flota al nivel máximo, deja de mandar la señal eléctrica para interrumpir el proceso de purificación y deja de llenarse el tanque de agua producto.',
    imagenes: [
      'Tanque con electronivel hacia abajo (bajo nivel de agua)',
      'Tanque con electronivel flotando (nivel máximo)',
    ],
    tags: ['electronivel', 'tanque', 'automatico', 'purificacion'],
  },
  {
    id: '15',
    titulo: 'Tanque de Almacenamiento de Agua Producto (Grado Alimenticio)',
    pagina: 21,
    contenido: 'Una vez que el agua cruda ha pasado por los filtros es almacenada en un tanque para agua producto. En este tanque, el agua filtrada y el agua producto de la ósmosis pasan por la válvula de mezcla para ser combinadas hasta alcanzar el nivel de Sólidos Disueltos Totales (SDT) deseados; los cuales caracterizan la percepción del "sabor" del agua.',
    imagenes: ['Tanque de almacenamiento de agua producto gris'],
    tags: ['tanque', 'almacenamiento', 'agua', 'producto', 'grado alimenticio'],
  },
  {
    id: '16',
    titulo: 'Lavado y Desinfección de Tubería',
    pagina: 21,
    contenido: 'Para desinfectar la tubería del agua producto, realice la cloración de la línea del agua producto a los despachadores.',
    frecuencia: 'Una vez al mes y recién instalada la planta.',
    pasos: [
      {
        numero: 1,
        descripcion: 'Llene el tanque de agua producto con 250 litros de agua y agregue 150 mL de cloro comercial (se recomienda Cloralex), la cantidad de agua puede variar dependiendo del recorrido de la tubería.',
        imagen: 'Tanque con 150ml de cloro marcado',
      },
      {
        numero: 2,
        descripcion: 'Abra de forma manual la válvula solenoide de llenado girando la bobina en sentido ON (izquierda), para que haya flujo de agua, por la tubería de llenado.',
        imagen: 'Válvula solenoide en posición ON',
      },
      {
        numero: 3,
        descripcion: 'Hasta percibir el olor a cloro en la espiga de llenado, cierre la válvula solenoide girando la bobina en sentido OFF (derecha).',
        imagen: 'Válvula solenoide girándose a OFF',
      },
      {
        numero: 4,
        descripcion: 'Para que haya flujo de agua por la tubería de enjuague, abra de forma manual la válvula solenoide en sentido ON, hasta percibir el olor a cloro en la cabina de llenado. Cierre la válvula girando en sentido OFF.',
        imagen: 'Sistema de tuberías con válvula solenoide',
      },
      {
        numero: 5,
        descripcion: 'Deje la tubería con cloro en reposo de 8 a 12 horas. Una vez transcurrido el tiempo, abra la válvula solenoide del enjuague y llenado. A continuación, saque el agua que pudo haber quedado dentro de la tubería y el tanque de agua producto.',
        imagen: 'Tuberías en reposo con cloro',
      },
      {
        numero: 6,
        descripcion: 'Por último, llene el tanque con agua filtrada y abrir nuevamente la válvula solenoide de enjuague y posteriormente la de llenado. Drene toda el agua hasta que no se perciba el olor a cloro, esto ayuda a eliminar el cloro de la tubería.',
      },
    ],
    tags: ['lavado', 'desinfeccion', 'tuberia', 'cloro'],
    importante: 'Cuando el equipo Vending es nuevo, debe realizar la desinfección de la tubería las veces que sean necesarias para retirar el olor y sabor a pegamento. De igual manera, se debe lavar el tanque en ese mismo momento.',
  },
  {
    id: '17',
    titulo: 'Lavado y Desinfección de Tanque',
    pagina: 23,
    contenido: 'Procedimiento para lavar y desinfectar el tanque de almacenamiento.',
    frecuencia: 'Una vez al mes y recién instalada la planta.',
    pasos: [
      {
        numero: 1,
        descripcion: 'Lave perfectamente con germicida y trapo de microfibra todas las paredes internas del tanque asegurándose de no dejar manchas o residuos.',
      },
      {
        numero: 2,
        descripcion: 'Después del lavado interno, enjuague con abundante agua y retire el agua que se acumule en el tanque. A continuación, seque con un trapo de microfibra que no deje residuos.',
      },
      {
        numero: 3,
        descripcion: 'Verifique el nivel del cloro en el tanque de agua cruda (este tanque es opcional). En caso de que el agua no contenga cloro se dosifica de acuerdo a la Tabla 3.',
      },
    ],
    tags: ['lavado', 'desinfeccion', 'tanque', 'limpieza'],
    subsecciones: [
      {
        titulo: 'Tabla 3: Adición de cloro a tanque de agua',
        contenido: `
Capacidad del tanque (L) | Cloro comercial (Hipoclorito de sodio de 4 a 6%)
450  | 22.5 mL
1100 | 55 mL
2500 | 125 mL
5000 | 250 mL

Nota: Verifique que el cloro a ocupar solo contenga hipoclorito de sodio, por ejemplo cloralex verde
        `,
      },
    ],
  },
  {
    id: '18',
    titulo: 'Lámpara de Luz Ultravioleta (UV)',
    pagina: 24,
    contenido: 'A diferencia de los métodos químicos de desinfección de agua, la radiación ultravioleta (UV) proporciona una inactivación rápida y eficiente de los microorganismos mediante un proceso físico. Cuando las bacterias y los virus se exponen a las longitudes de onda germicidas de la luz UV, se vuelven incapaces de reproducirse e infectar. Se ha demostrado que la luz UV es eficaz frente a microorganismos patógenos, como los causantes del cólera, la polio, la fiebre tifoidea, la hepatitis y otras enfermedades bacterianas, víricas y parasitarias. Esta lámpara elimina el 99% de las bacterias y virus potencialmente dañinos encontrados en el agua.',
    imagenes: ['Lámpara UV horizontal instalada', 'Diagrama de virus siendo destruido por luz UV'],
    tags: ['uv', 'ultravioleta', 'desinfeccion', 'bacterias', 'virus'],
  },
  {
    id: '19',
    titulo: 'Cambio de Foco de Luz Ultravioleta',
    pagina: 24,
    contenido: 'Cuando el foco del balastro encienda en color rojo o haya transcurrido un año, es momento de realizar el cambio de foco de luz ultravioleta.',
    frecuencia: 'Se recomienda 1 vez al año.',
    pasos: [
      {
        numero: 1,
        descripcion: 'Desconecte la lámpara de la fuente de energía.',
        imagen: 'Fuente de energía desconectada',
      },
      {
        numero: 2,
        descripcion: 'Retire con cuidado el capuchón negro del extremo.',
        imagen: 'Capuchón negro siendo retirado',
      },
      {
        numero: 3,
        descripcion: 'Observe la conexión de la lámpara.',
        imagen: 'Conexión de lámpara visible',
      },
      {
        numero: 4,
        descripcion: 'Separe el conector de los filamentos del foco UV.',
        imagen: 'Filamentos del foco UV siendo separados',
      },
      {
        numero: 5,
        descripcion: 'Saque el foco UV de la carcasa de acero inoxidable.',
        imagen: 'Foco UV siendo extraído de carcasa',
      },
      {
        numero: 6,
        descripcion: 'Desconecte los filamentos de ambos extremos.',
        imagen: 'Foco UV con filamentos en ambos extremos',
      },
      {
        numero: 7,
        descripcion: 'Coloque el nuevo foco de la misma manera que se retiró el anterior.',
        imagen: 'Foco nuevo siendo conectado',
      },
    ],
    tags: ['cambio', 'foco', 'uv', 'mantenimiento'],
  },
  {
    id: '20',
    titulo: 'Limpieza de Cuarzo',
    pagina: 26,
    contenido: 'Es importante realizar la limpieza al cuarzo que cubre al foco UV para que permita filtrar la cantidad de luz adecuada.',
    frecuencia: 'Se recomienda una vez al año.',
    pasos: [
      {
        numero: 1,
        descripcion: 'Desconecte la lámpara UV y el presurizador de la corriente eléctrica. Posteriormente, cierre la válvula del tanque de agua producto.',
        imagen: 'Lámpara UV y presurizador señalados',
      },
      {
        numero: 2,
        descripcion: 'Despresurice la línea (girando la bobina de la válvula solenoide en sentido ON).',
        imagen: 'Válvula solenoide en posición ON',
      },
      {
        numero: 3,
        descripcion: 'Retire con cuidado el capuchón negro del extremo.',
        imagen: 'Capuchón negro siendo retirado',
      },
      {
        numero: 4,
        descripcion: 'Retire el foco ultravioleta y desconéctelo del balastro.',
        imagen: 'Foco UV desconectado del balastro',
      },
      {
        numero: 5,
        descripcion: 'Retire las tapas roscables de la carcasa de la lámpara.',
        imagen: 'Tapas roscables siendo retiradas',
      },
      {
        numero: 6,
        descripcion: 'Retire los empaques que sostienen el cuarzo y retirar el mismo.',
        imagen: 'Empaques y cuarzo',
      },
      {
        numero: 7,
        descripcion: 'Limpie perfectamente el cuarzo con un trapo de microfibra.',
        imagen: 'Cuarzo siendo limpiado',
      },
      {
        numero: 8,
        descripcion: 'Coloque nuevamente las piezas antes retiradas.',
        imagen: 'Piezas ensambladas: empaque, cuarzo, lámpara UV completa',
      },
      {
        numero: 9,
        descripcion: 'Abra la válvula del tanque de almacenamiento de agua producto.',
        imagen: 'Tanque de agua con válvula',
      },
      {
        numero: 10,
        descripcion: 'Purgue la bomba abriendo la válvula (A) y ciérrela hasta que salga agua. Posteriormente conecte a la corriente eléctrica.',
        imagen: 'Bomba con válvula A señalada',
      },
    ],
    tags: ['limpieza', 'cuarzo', 'uv', 'mantenimiento'],
  },
  {
    id: '21',
    titulo: 'Mantenimiento a Válvula Solenoide',
    pagina: 28,
    contenido: 'Este tipo de válvula funciona al recibir una señal eléctrica para permitir o bloquear el paso del agua. En caso de que exista un "goteo" en el área de llenado o en el área de lavado, se deben seguir los siguientes pasos:',
    pasos: [
      {
        numero: 1,
        descripcion: 'Desconecte el equipo de la corriente eléctrica.',
        imagen: 'Equipo con cable de corriente',
      },
      {
        numero: 2,
        descripcion: 'Cierre la válvula de paso del tanque de agua producto y despresurice la línea para esto, posicione la válvula solenoide y gire la bobina en el sentido ON; esta acción hace que la presión acumulada salga por el despachador.',
        imagen: 'Válvula solenoide con bobina en sentido ON',
      },
      {
        numero: 3,
        descripcion: 'Con una matraca y un dado 3/16" (o desarmador) desatornille los tornillos de la tapa de la válvula. Posteriormente retire la tapa, el resorte, el diafragma y la base del diafragma.',
        imagen: 'Partes de la válvula siendo desarmadas',
      },
      {
        numero: 4,
        descripcion: 'Lave con agua purificada todos los componentes que fueron retirados.',
      },
      {
        numero: 5,
        descripcion: 'Coloque la base del diafragma y el diafragma cuidando la posición en la que se colocan.',
        imagen: 'Diafragma siendo colocado',
        advertencia: 'No debe quedar ningún residuo por muy pequeño que sea.',
      },
      {
        numero: 6,
        descripcion: 'Estire el resorte con fuerza moderada, debe quedar a una altura de 2.5 a 3 cm.',
        imagen: 'Resorte estirado con medida de 2.5 a 3 cm',
      },
      {
        numero: 7,
        descripcion: 'Coloque el resorte en la posición correcta, después coloque la tapa y los cuatro tornillos en forma cruzada.',
        imagen: 'Resorte, tapa y tornillos colocados en forma cruzada',
      },
      {
        numero: 8,
        descripcion: 'Por último, gire en sentido OFF para cerrar la válvula solenoide, abra la válvula de paso del tanque de agua producto y conecte el equipo a la energía eléctrica.',
        imagen: 'Válvula en posición OFF',
      },
    ],
    tags: ['mantenimiento', 'valvula', 'solenoide', 'goteo'],
  },
  {
    id: '22',
    titulo: 'Ozono (O₃)',
    pagina: 30,
    contenido: 'Es uno de los gases oxidantes más potentes, es alrededor de diez veces más poderoso que el cloro y mata todo tipo de microorganismos presentes en el agua. Cuando el ozono hace frente a olores, bacterias y virus el átomo adicional del oxígeno los destruye por oxidación con una efectividad de 99%. El ozono no solamente es un desinfectante eficaz, también es particularmente seguro. Sus principales funciones en el agua son: 1) Mata virus y microorganismos que no son sensibles a la desinfección con cloro. 2) Ayuda a la oxidación de algunos metales como son el hierro y manganeso, con lo cual se hace más sencillo el proceso de precipitación. 3) El ozono no produce aumento de sales y minerales en el agua, ni subproductos nocivos.',
    imagenes: ['Generador de ozono OzonePurfier'],
    tags: ['ozono', 'o3', 'desinfeccion', 'oxidacion'],
  },
  {
    id: '23',
    titulo: 'Desinfección de la Cabina con Ozono (O₃)',
    pagina: 31,
    contenido: 'En el caso de las ventanas despachad oras, el ozono se conecta directamente a través del tubing a la cabina de llenado. El ozono desinfecta la cabina de llenado y la tapa del garrafón que se coloca en la parte superior, esto ayuda a que no exista una contaminación cruzada por microorganismos que entran a la cabina por la exposición de la ventana despachadora al exterior. Por último, tras concluir el llenado, el equipo de desinfección de ozono se desactiva automáticamente para que el usuario pueda retirar su botella o garrafón y tapa.',
    imagenes: ['Cabina de llenado con ozono (ventana despachadora de Agua Inmaculada)', 'Señalización de cabina de llenado con desinfección por ozono'],
    tags: ['ozono', 'desinfeccion', 'cabina', 'vending'],
    importante: 'Recuerde que el equipo de ozono solo se activa en el momento del llenado de garrafón.',
  },
  {
    id: '24',
    titulo: 'Frecuencia de Análisis al Agua Producto',
    pagina: 32,
    contenido: 'Tabla de frecuencias recomendadas para análisis de laboratorio.',
    subsecciones: [
      {
        titulo: 'Tabla de Frecuencias',
        contenido: `
Especificación | Frecuencia
-----------------------------------
Organolépticos y físicos | Mensual
Coliformes totales | Semanal
Metales, metaloides y compuestos orgánicos | Anual
Compuestos orgánicos sintéticos | Anual
Desinfectantes (cloro residual) | Cada cuatro horas
Subproductos de desinfección | Anual
Radioactivos | Cada cinco años
        `,
      },
    ],
    tags: ['analisis', 'frecuencia', 'laboratorio', 'calidad'],
    importante: 'Ingrese a la página www.aguainmaculada.com sección franquiciatarios, donde puede encontrar videos tutoriales para realizar el mantenimiento adecuado a sus equipos.',
  },
  {
    id: '25',
    titulo: 'Frecuencia de Mantenimiento a Equipos de Purificación',
    pagina: 33,
    contenido: 'Tabla de frecuencias de mantenimiento recomendadas para los equipos.',
    subsecciones: [
      {
        titulo: 'Tabla de Mantenimientos',
        contenido: `
Equipo | Tipo | Frecuencia | Requiere cambio
------------------------------------------------------
Cloración de línea | Lavado interno de tubería | Mensual | -
Filtro dual de Arena/Carbón | Retrolavado | Semanal | Anual (Depende de la calidad del agua)
Filtro suavizador | Regeneración | Depende directamente de la calidad del agua cruda | -
Filtro pulidor | Lavado | Semanal | Variable de 3 a 6 meses (Depende de la calidad del agua)
Membranas | Cambio | Depende de la calidad del agua | Sí
Lámpara UV | Cambio | - | Anual
Cuarzo | Limpieza | Anual | Solo en caso de avería
Tanque de agua producto | Lavado interno | Mensual | -
Ozonificador | Mantenimiento preventivo | Anual | Solo en caso de avería
Válvula solenoide | Mantenimiento preventivo | - | Solo en caso de avería
Espigas de llenado | Limpieza interna | Diaria | -
        `,
      },
    ],
    tags: ['frecuencia', 'mantenimiento', 'equipos', 'calendario'],
  },
];
