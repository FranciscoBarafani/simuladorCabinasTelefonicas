import React, { useState } from "react";
import {
  Layout,
  Menu,
  Form,
  Table,
  Input,
  Button,
  Row,
  Col,
  Descriptions,
  Modal,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

import "./MainForm.scss";

export default function MainForm() {
  const [showModal, setShowModal] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pPersonasNConsiCabina, setPPersonasNConsiCabina] = useState(0);
  const [colaMaxCaja, setColaMaxCaja] = useState(0);
  const [tPromedioComunicaciones, setTPromedioComunicaciones] = useState(0);
  const [totalDineroAcumulado, setTotalDineroAcumulado] = useState(0);
  const [gananciaNeta, setGananciaNeta] = useState(0);
  //Informacion

  //Estados
  //Estados del Empleado --> 0 = Libre, 1 = Ocupado
  //Estados de Cabina --> 0 = Libre, 1 = Ocupada
  //Estados Cliente --> 0 = No Creado, 1 = Siendo Asignado, 2 = En llamada 21 o 22 , 3 = En Cola Asignacion, 4 = En Cola Cobro , 5 = Abonando

  //Eventos
  //0 -> Inicializacion
  //1 -> Llegada Cliente
  //2 -> Asignacion Cabina
  //3 -> Fin llamada cabina 1
  //4 -> Fin llamada cabina 2
  //5 -> Fin Cobro

  //Layout
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 4 },
  };
  const tailLayout = {
    wrapperCol: { span: 16 },
  };

  const onFinish = (formData) => {
    const { cantidad, desde, hasta } = formData;
    simular(cantidad, desde, hasta);
  };

  const simular = (cantidadSim, desde, hasta) => {
    setIsLoading(true);
    //Vectores
    var vectorActual = {
      evento: 0,
      reloj: 0,
      randLlegada: 0,
      tEntreLlegada: 0,
      proximaLlegada: 0,
      proximaACabina: 0,
      randDLlamada: 0,
      duracionLlamada: 0,
      finLlamadaCabina1: 0,
      finLlamadaCabina2: 0,
      proximoFinCobro: 0,
      empleado: {
        colaAsignacion: 0,
        colaCobro: 0,
        estado: 0,
      },
      cabina1: 0,
      cabina2: 0,
      cliente1: {
        estado: 0,
        horaInicioLlamada: 0,
        horaFinLlamada: 0,
      },
      cliente2: {
        estado: 0,
        horaInicioLlamada: 0,
        horaFinLlamada: 0,
      },
      cliente3: {
        estado: 0,
        horaInicioLlamada: 0,
        horaFinLlamada: 0,
      },
      cliente4: {
        estado: 0,
        horaInicioLlamada: 0,
        horaFinLlamada: 0,
      },
      cliente5: {
        estado: 0,
        horaInicioLlamada: 0,
        horaFinLlamada: 0,
      },
      duracionLlamadaFinalizada: 0,
      costo: 0,
      acClientes: 0,
      acClientesNoAtendidos: 0,
      maxColaCaja: 0,
      acTiempoLlamadas: 0,
      acCantidadLlamadas: 0,
      acIngresos: 0,
      acCajaNeta: 0,
    };
    //Vector Anterior
    var vectorAnterior;
    //Vectores que se van colocando en la tabla
    var vectores = [];

    for (var i = 0; i <= cantidadSim; i++) {
      switch (vectorActual.evento) {
        //Inicializacion
        case 0:
          vectorActual.randLlegada = Math.random();
          vectorActual.tEntreLlegada = getLlegadaCliente(
            vectorActual.randLlegada
          );
          vectorActual.proximaLlegada = vectorActual.tEntreLlegada;
          break;

        //Llegada Cliente
        case 1:
          vectorActual.reloj = vectorActual.proximaLlegada;
          //Corroboro que no esten ocupadas ambas cabinas
          if (vectorAnterior.cabina1 === 1 && vectorAnterior.cabina2 === 1) {
            vectorActual.acClientesNoAtendidos++;
            //Calculo Proxima Llegada de Cliente
            vectorActual.randLlegada = Math.random();
            vectorActual.tEntreLlegada = getLlegadaCliente(
              vectorActual.randLlegada
            );
            vectorActual.proximaLlegada =
              vectorActual.tEntreLlegada + vectorActual.reloj;
            break;
          }
          // Corroboro si hay un cliente esperando a ser asignado y hay una cabina libre
          //el cliente se tiene que ir ya que no podra ser asignado
          else {
            //Corroboro que Columna de Cliente esta sin usar para asignar el proximo cliente
            if (vectorAnterior.cliente1.estado === 0) {
              //Corroboro que el empleado este libre, si esta ocupado lo coloco en la cola para ser asignado
              if (vectorAnterior.empleado.estado === 0) {
                //Asigno el estado siendo asignado
                vectorActual.cliente1.estado = 1;
                //Empleado Ocupado
                vectorActual.empleado.estado = 1;
                //Proxima Asignacion de Cabina
                vectorActual.proximaACabina = vectorActual.reloj + 0.16;
                //Sumo el Acumulado de Clientes
                vectorActual.acClientes++;
              } else {
                //Coloco al cliente en la cola de Asignacion
                vectorActual.empleado.colaAsignacion++;
                vectorActual.cliente1.estado = 3;
              }
            } else if (vectorAnterior.cliente2.estado === 0) {
              if (vectorAnterior.empleado.estado === 0) {
                vectorActual.cliente2.estado = 1;
                vectorActual.empleado.estado = 1;
                vectorActual.proximaACabina = vectorActual.reloj + 0.16;
              } else {
                vectorActual.empleado.colaAsignacion++;
                vectorActual.cliente2.estado = 3;
              }
            } else if (vectorAnterior.cliente3.estado === 0) {
              if (vectorAnterior.empleado.estado === 0) {
                vectorActual.cliente3.estado = 1;
                vectorActual.empleado.estado = 1;
                vectorActual.proximaACabina = vectorActual.reloj + 0.16;
              } else {
                vectorActual.empleado.colaAsignacion++;
                vectorActual.cliente3.estado = 3;
              }
            } else if (vectorAnterior.cliente4.estado === 0) {
              if (vectorAnterior.empleado.estado === 0) {
                vectorActual.cliente4.estado = 1;
                vectorActual.empleado.estado = 1;
                vectorActual.proximaACabina = vectorActual.reloj + 0.16;
              } else {
                vectorActual.empleado.colaAsignacion++;
                vectorActual.cliente4.estado = 3;
              }
            } else {
              if (vectorAnterior.empleado.estado === 0) {
                vectorActual.cliente5.estado = 1;
                vectorActual.empleado.estado = 1;
                vectorActual.proximaACabina = vectorActual.reloj + 0.16;
              } else {
                vectorActual.empleado.colaAsignacion++;
                vectorActual.cliente5.estado = 3;
              }
            }
            //Calculo Proxima Llegada de Cliente
            vectorActual.randLlegada = Math.random();
            vectorActual.tEntreLlegada = getLlegadaCliente(
              vectorActual.randLlegada
            );
            vectorActual.proximaLlegada =
              vectorActual.tEntreLlegada + vectorActual.reloj;
            break;
          }

        //Asignacion Cabina
        case 2:
          vectorActual.reloj = vectorActual.proximaACabina;
          //Libero El Empleado
          vectorActual.empleado.estado = 0;
          //Seteo la proxima asignacion de cabina a 0, en caso que se comienze una nueva asignacion esta se modifica en el siguiente if
          vectorActual.proximaACabina = 0;
          //Calculo Tiempo de Llamada
          vectorActual.randDLlamada = Math.random();
          vectorActual.duracionLlamada = getDuracionLlamada(
            vectorActual.randDLlamada
          );
          //Asigno la duracion de llamada verificando que cabina esta vacia
          //Esta variable es para dejar asentado que cabina es la que esta libre
          var cabina = 0;
          if (vectorAnterior.cabina1 === 0) {
            vectorActual.finLlamadaCabina1 =
              vectorActual.duracionLlamada + vectorActual.reloj;
            vectorActual.cabina1 = 1;
            cabina = 1;
          } else if (vectorAnterior.cabina2 === 0) {
            vectorActual.finLlamadaCabina2 =
              vectorActual.duracionLlamada + vectorActual.reloj;
            vectorActual.cabina2 = 1;
            cabina = 2;
          }
          //Asigno estado a Cliente y Hora de inicio de llamada
          //Chequeo que cliente es el que estaba siendo asignado
          if (vectorAnterior.cliente1.estado === 1) {
            if (cabina === 1) {
              //Asigno Cabina 1
              vectorActual.cliente1.estado = 21;
            } else {
              //Asigno Cabina2
              vectorActual.cliente1.estado = 22;
            }
            //Asigno Hora de Inicio de Llamada
            vectorActual.cliente1.horaInicioLlamada = vectorActual.reloj;
          } else if (vectorAnterior.cliente2.estado === 1) {
            if (cabina === 1) {
              vectorActual.cliente2.estado = 21;
            } else {
              vectorActual.cliente2.estado = 22;
            }
            vectorActual.cliente2.horaInicioLlamada = vectorActual.reloj;
          } else if (vectorAnterior.cliente3.estado === 1) {
            if (cabina === 1) {
              vectorActual.cliente3.estado = 21;
            } else {
              vectorActual.cliente3.estado = 22;
            }
            vectorActual.cliente3.horaInicioLlamada = vectorActual.reloj;
          } else if (vectorAnterior.cliente4.estado === 1) {
            if (cabina === 1) {
              vectorActual.cliente4.estado = 21;
            } else {
              vectorActual.cliente4.estado = 22;
            }
            vectorActual.cliente4.horaInicioLlamada = vectorActual.reloj;
          } else if (vectorAnterior.cliente5.estado === 1) {
            if (cabina === 1) {
              vectorActual.cliente5.estado = 21;
            } else {
              vectorActual.cliente5.estado = 22;
            }
            vectorActual.cliente5.horaInicioLlamada = vectorActual.reloj;
          }
          //Asignacion del estado del Empleado y actualizo la cola de asignacion
          //Chequeo si hay alguien en la cola para ser asignado, de ser asi comienzo a asignarle una cabina
          if (
            vectorAnterior.empleado.colaAsignacion > 0 &&
            (vectorActual.cabina1 === 0 || vectorActual.cabina2 === 0)
          ) {
            vectorActual.empleado.colaAsignacion--;
            if (vectorAnterior.cliente1.estado === 3) {
              vectorActual.cliente1.estado = 1;
              vectorActual.empleado.estado = 1;
              vectorActual.proximaACabina = vectorActual.reloj + 0.16;
            } else if (vectorAnterior.cliente2.estado === 3) {
              vectorActual.cliente2.estado = 1;
              vectorActual.empleado.estado = 1;
              vectorActual.proximaACabina = vectorActual.reloj + 0.16;
            } else if (vectorAnterior.cliente3.estado === 3) {
              vectorActual.cliente3.estado = 1;
              vectorActual.empleado.estado = 1;
              vectorActual.proximaACabina = vectorActual.reloj + 0.16;
            } else if (vectorAnterior.cliente4.estado === 3) {
              vectorActual.cliente4.estado = 1;
              vectorActual.empleado.estado = 1;
              vectorActual.proximaACabina = vectorActual.reloj + 0.16;
            } else if (vectorAnterior.cliente5.estado === 3) {
              vectorActual.cliente5.estado = 1;
              vectorActual.empleado.estado = 1;
              vectorActual.proximaACabina = vectorActual.reloj + 0.16;
            }
          }
          //Cuando termino de asignar puede aparecer un cobro un nuevo si es que no se esta asignando uno nuevo
          if (
            vectorActual.empleado.estado === 0 &&
            vectorAnterior.empleado.colaCobro > 0
          ) {
            vectorActual.empleado.estado = 1;
            //Resto uno de la cola para el cobro
            vectorActual.empleado.colaCobro--;
            vectorActual.proximoFinCobro = vectorActual.reloj + 0.25;
            //Chequeo que Cliente estaba en la cola para ser cobrado y le asigno el nuevo estado.
            if (vectorActual.cliente1.estado === 4) {
              vectorActual.cliente1.estado = 5;
            } else if (vectorActual.cliente2.estado === 4) {
              vectorActual.cliente2.estado = 5;
            } else if (vectorActual.cliente3.estado === 4) {
              vectorActual.cliente3.estado = 5;
            } else if (vectorActual.cliente4.estado === 4) {
              vectorActual.cliente4.estado = 5;
            } else if (vectorActual.cliente5.estado === 4) {
              vectorActual.cliente5.estado = 5;
            }
          }
          break;

        //Fin-Llamada-Cabina-1
        case 3:
          vectorActual.reloj = vectorActual.finLlamadaCabina1;
          //Fin llamada =  0
          vectorActual.cabina1 = 0;
          vectorActual.finLlamadaCabina1 = 0;
          //Estado de Empleado, si comienza a cobrar pasa a Ocupado, si ya esta ocupado sumar el cliente a la cola de cobro
          //Calcular proximo fin de cobro si empleado esta libre -> Set empleado ocupado
          //Actualizar estado de cabina y de cliente
          if (vectorAnterior.empleado.estado === 0) {
            //Empleado Ocupado , comienza a cobrar
            vectorAnterior.empleado.estado = 1;
            //Calcular proximo fin de cobro
            vectorActual.proximoFinCobro = vectorActual.reloj + 0.25;
            //Cambio estado de Cliente/Veo que cliente estaba en la cabina
            if (vectorAnterior.cliente1.estado === 21) {
              //Estado de cliente -> Abonando
              vectorActual.cliente1.estado = 5;
              vectorActual.cliente1.horaFinLlamada = vectorActual.reloj;
              //Calculo el tiempo acumulado de llamadas
              vectorActual.acTiempoLlamadas =
                vectorAnterior.acTiempoLlamadas +
                (vectorActual.reloj -
                  vectorAnterior.cliente1.horaInicioLlamada);
            } else if (vectorAnterior.cliente2.estado === 21) {
              vectorActual.cliente2.estado = 5;
              vectorActual.cliente2.horaFinLlamada = vectorActual.reloj;
              vectorActual.acTiempoLlamadas =
                vectorAnterior.acTiempoLlamadas +
                (vectorActual.reloj -
                  vectorAnterior.cliente2.horaInicioLlamada);
            }
            if (vectorAnterior.cliente3.estado === 21) {
              vectorActual.cliente3.estado = 5;
              vectorActual.cliente3.horaFinLlamada = vectorActual.reloj;
              vectorActual.acTiempoLlamadas =
                vectorAnterior.acTiempoLlamadas +
                (vectorActual.reloj -
                  vectorAnterior.cliente3.horaInicioLlamada);
            }
            if (vectorAnterior.cliente4.estado === 21) {
              vectorActual.cliente4.estado = 5;
              vectorActual.cliente4.horaFinLlamada = vectorActual.reloj;
              vectorActual.acTiempoLlamadas =
                vectorAnterior.acTiempoLlamadas +
                (vectorActual.reloj -
                  vectorAnterior.cliente4.horaInicioLlamada);
            }
            if (vectorAnterior.cliente5.estado === 21) {
              vectorActual.cliente5.estado = 5;
              vectorActual.cliente5.horaFinLlamada = vectorActual.reloj;
              vectorActual.acTiempoLlamadas =
                vectorAnterior.acTiempoLlamadas +
                (vectorActual.reloj -
                  vectorAnterior.cliente5.horaInicioLlamada);
            }
          } else {
            //El empleado esta Ocupado, coloco el cliente en Cola
            if (vectorAnterior.cliente1.estado === 21) {
              //Estado de cliente -> Abonando
              vectorActual.cliente1.estado = 4;
              vectorActual.cliente1.horaFinLlamada = vectorActual.reloj;
              vectorActual.acTiempoLlamadas =
                vectorAnterior.acTiempoLlamadas +
                (vectorActual.reloj -
                  vectorAnterior.cliente1.horaInicioLlamada);
            } else if (vectorAnterior.cliente2.estado === 21) {
              vectorActual.cliente2.estado = 4;
              vectorActual.cliente2.horaFinLlamada = vectorActual.reloj;
              vectorActual.acTiempoLlamadas =
                vectorAnterior.acTiempoLlamadas +
                (vectorActual.reloj -
                  vectorAnterior.cliente2.horaInicioLlamada);
            } else if (vectorAnterior.cliente3.estado === 21) {
              vectorActual.cliente3.estado = 4;
              vectorActual.cliente3.horaFinLlamada = vectorActual.reloj;
              vectorActual.acTiempoLlamadas =
                vectorAnterior.acTiempoLlamadas +
                (vectorActual.reloj -
                  vectorAnterior.cliente3.horaInicioLlamada);
            } else if (vectorAnterior.cliente4.estado === 21) {
              vectorActual.cliente4.estado = 4;
              vectorActual.cliente4.horaFinLlamada = vectorActual.reloj;
              vectorActual.acTiempoLlamadas =
                vectorAnterior.acTiempoLlamadas +
                (vectorActual.reloj -
                  vectorAnterior.cliente4.horaInicioLlamada);
            } else if (vectorAnterior.cliente5.estado === 21) {
              vectorActual.cliente5.estado = 4;
              vectorActual.cliente5.horaFinLlamada = vectorActual.reloj;
              vectorActual.acTiempoLlamadas =
                vectorAnterior.acTiempoLlamadas +
                (vectorActual.reloj -
                  vectorAnterior.cliente5.horaInicioLlamada);
            }
            //Sumo uno a la cola de cobro
            vectorActual.empleado.colaCobro++;
          }
          //Sumo una llamada al acumulado
          vectorActual.acCantidadLlamadas =
            vectorAnterior.acCantidadLlamadas + 1;
          break;

        //Fin-Llamada-Cabina-2
        case 4:
          vectorActual.reloj = vectorActual.finLlamadaCabina2;
          vectorActual.cabina2 = 0;
          vectorActual.finLlamadaCabina2 = 0;
          if (vectorAnterior.empleado.estado === 0) {
            vectorAnterior.empleado.estado = 1;
            vectorActual.proximoFinCobro = vectorActual.reloj + 0.25;
            if (vectorAnterior.cliente1.estado === 22) {
              vectorActual.cliente1.estado = 5;
              vectorActual.cliente1.horaFinLlamada = vectorActual.reloj;
              vectorActual.acTiempoLlamadas =
                vectorAnterior.acTiempoLlamadas +
                (vectorActual.reloj -
                  vectorAnterior.cliente1.horaInicioLlamada);
            } else if (vectorAnterior.cliente2.estado === 22) {
              vectorActual.cliente2.estado = 5;
              vectorActual.cliente2.horaFinLlamada = vectorActual.reloj;
              vectorActual.acTiempoLlamadas =
                vectorAnterior.acTiempoLlamadas +
                (vectorActual.reloj -
                  vectorAnterior.cliente2.horaInicioLlamada);
            }
            if (vectorAnterior.cliente3.estado === 22) {
              vectorActual.cliente3.estado = 5;
              vectorActual.cliente3.horaFinLlamada = vectorActual.reloj;
              vectorActual.acTiempoLlamadas =
                vectorAnterior.acTiempoLlamadas +
                (vectorActual.reloj -
                  vectorAnterior.cliente3.horaInicioLlamada);
            }
            if (vectorAnterior.cliente4.estado === 22) {
              vectorActual.cliente4.estado = 5;
              vectorActual.cliente4.horaFinLlamada = vectorActual.reloj;
              vectorActual.acTiempoLlamadas =
                vectorAnterior.acTiempoLlamadas +
                (vectorActual.reloj -
                  vectorAnterior.cliente4.horaInicioLlamada);
            }
            if (vectorAnterior.cliente5.estado === 22) {
              vectorActual.cliente5.estado = 5;
              vectorActual.cliente5.horaFinLlamada = vectorActual.reloj;
              vectorActual.acTiempoLlamadas =
                vectorAnterior.acTiempoLlamadas +
                (vectorActual.reloj -
                  vectorAnterior.cliente5.horaInicioLlamada);
            }
          } else {
            if (vectorAnterior.cliente1.estado === 22) {
              vectorActual.cliente1.estado = 4;
              vectorActual.cliente1.horaFinLlamada = vectorActual.reloj;
              vectorActual.acTiempoLlamadas =
                vectorAnterior.acTiempoLlamadas +
                (vectorActual.reloj -
                  vectorAnterior.cliente1.horaInicioLlamada);
            } else if (vectorAnterior.cliente2.estado === 22) {
              vectorActual.cliente2.estado = 4;
              vectorActual.cliente2.horaFinLlamada = vectorActual.reloj;
              vectorActual.acTiempoLlamadas =
                vectorAnterior.acTiempoLlamadas +
                (vectorActual.reloj -
                  vectorAnterior.cliente2.horaInicioLlamada);
            } else if (vectorAnterior.cliente3.estado === 22) {
              vectorActual.cliente3.estado = 4;
              vectorActual.cliente3.horaFinLlamada = vectorActual.reloj;
              vectorActual.acTiempoLlamadas =
                vectorAnterior.acTiempoLlamadas +
                (vectorActual.reloj -
                  vectorAnterior.cliente3.horaInicioLlamada);
            } else if (vectorAnterior.cliente4.estado === 22) {
              vectorActual.cliente4.estado = 4;
              vectorActual.cliente4.horaFinLlamada = vectorActual.reloj;
              vectorActual.acTiempoLlamadas =
                vectorAnterior.acTiempoLlamadas +
                (vectorActual.reloj -
                  vectorAnterior.cliente4.horaInicioLlamada);
            } else if (vectorAnterior.cliente5.estado === 22) {
              vectorActual.cliente5.estado = 4;
              vectorActual.cliente5.horaFinLlamada = vectorActual.reloj;
              vectorActual.acTiempoLlamadas =
                vectorAnterior.acTiempoLlamadas +
                (vectorActual.reloj -
                  vectorAnterior.cliente5.horaInicioLlamada);
            }
            //Sumo uno a la cola de cobro
            vectorActual.empleado.colaCobro++;
          }
          vectorActual.acCantidadLlamadas =
            vectorAnterior.acCantidadLlamadas + 1;
          break;

        //Fin Cobro
        case 5:
          vectorActual.reloj = vectorActual.proximoFinCobro;
          vectorActual.proximoFinCobro = 0;
          vectorActual.empleado.estado = 0;
          //Calculo el costo
          //Obtengo el cliente que estaba siendo cobrado
          if (vectorAnterior.cliente1.estado === 5) {
            //Calculo duracion de llamada
            vectorActual.duracionLlamadaFinalizada =
              vectorAnterior.cliente1.horaFinLlamada -
              vectorAnterior.cliente1.horaInicioLlamada;
            vectorActual.costo = getCostoLlamada(
              vectorActual.duracionLlamadaFinalizada
            );
            vectorActual.acIngresos =
              vectorAnterior.acIngresos + vectorActual.costo;
            //Elimino Cliente
            vectorActual.cliente1.estado = 0;
            vectorActual.cliente1.horaFinLlamada = 0;
            vectorActual.cliente1.horaInicioLlamada = 0;
          } else if (vectorAnterior.cliente2.estado === 5) {
            vectorActual.duracionLlamadaFinalizada =
              vectorAnterior.cliente2.horaFinLlamada -
              vectorAnterior.cliente2.horaInicioLlamada;
            vectorActual.costo = getCostoLlamada(
              vectorActual.duracionLlamadaFinalizada
            );
            vectorActual.acIngresos =
              vectorAnterior.acIngresos + vectorActual.costo;
            vectorActual.cliente2.estado = 0;
            vectorActual.cliente2.horaFinLlamada = 0;
            vectorActual.cliente2.horaInicioLlamada = 0;
          } else if (vectorAnterior.cliente3.estado === 5) {
            vectorActual.duracionLlamadaFinalizada =
              vectorAnterior.cliente3.horaFinLlamada -
              vectorAnterior.cliente3.horaInicioLlamada;
            vectorActual.costo = getCostoLlamada(
              vectorActual.duracionLlamadaFinalizada
            );
            vectorActual.acIngresos =
              vectorAnterior.acIngresos + vectorActual.costo;
            vectorActual.cliente3.estado = 0;
            vectorActual.cliente3.horaFinLlamada = 0;
            vectorActual.cliente3.horaInicioLlamada = 0;
          } else if (vectorAnterior.cliente4.estado === 5) {
            vectorActual.duracionLlamadaFinalizada =
              vectorAnterior.cliente4.horaFinLlamada -
              vectorAnterior.cliente4.horaInicioLlamada;
            vectorActual.costo = getCostoLlamada(
              vectorActual.duracionLlamadaFinalizada
            );
            vectorActual.acIngresos =
              vectorAnterior.acIngresos + vectorActual.costo;
            vectorActual.cliente4.estado = 0;
            vectorActual.cliente4.horaFinLlamada = 0;
            vectorActual.cliente4.horaInicioLlamada = 0;
          } else if (vectorAnterior.cliente5.estado === 5) {
            vectorActual.duracionLlamadaFinalizada =
              vectorAnterior.cliente5.horaFinLlamada -
              vectorAnterior.cliente5.horaInicioLlamada;
            vectorActual.costo = getCostoLlamada(
              vectorActual.duracionLlamadaFinalizada
            );
            vectorActual.acIngresos =
              vectorAnterior.acIngresos + vectorActual.costo;
            vectorActual.cliente5.estado = 0;
            vectorActual.cliente5.horaFinLlamada = 0;
            vectorActual.cliente5.horaInicioLlamada = 0;
          }
          //Veo si hay un nuevo cliente para asignar o cobrar
          //Hay cola para asignar y tienen prioridad sobre el cobro
          if (
            vectorAnterior.empleado.colaAsignacion > 0 &&
            (vectorActual.cabina1 === 0 || vectorActual.cabina2 === 0)
          ) {
            if (vectorAnterior.cliente1.estado === 3) {
              vectorActual.cliente1.estado = 1;
              vectorActual.empleado.estado = 1;
              vectorActual.proximaACabina = vectorActual.reloj + 0.16;
              vectorActual.empleado.colaAsignacion--;
            } else if (vectorAnterior.cliente2.estado === 3) {
              vectorActual.cliente2.estado = 1;
              vectorActual.empleado.estado = 1;
              vectorActual.proximaACabina = vectorActual.reloj + 0.16;
              vectorActual.empleado.colaAsignacion--;
            } else if (vectorAnterior.cliente3.estado === 3) {
              vectorActual.cliente3.estado = 1;
              vectorActual.empleado.estado = 1;
              vectorActual.proximaACabina = vectorActual.reloj + 0.16;
              vectorActual.empleado.colaAsignacion--;
            } else if (vectorAnterior.cliente4.estado === 3) {
              vectorActual.cliente4.estado = 1;
              vectorActual.empleado.estado = 1;
              vectorActual.proximaACabina = vectorActual.reloj + 0.16;
              vectorActual.empleado.colaAsignacion--;
            } else if (vectorAnterior.cliente5.estado === 3) {
              vectorActual.cliente5.estado = 1;
              vectorActual.empleado.estado = 1;
              vectorActual.proximaACabina = vectorActual.reloj + 0.16;
              vectorActual.empleado.colaAsignacion--;
            }
          } //No hay cola para asignar pero hay cola para cobrar, asigno al nuevo cliente para cobro
          else if (vectorAnterior.empleado.colaCobro > 0) {
            if (vectorAnterior.cliente1.estado === 4) {
              vectorActual.cliente1.estado = 5;
              vectorActual.proximoFinCobro = vectorActual.reloj + 0.25;
              vectorActual.empleado.estado = 1;
              vectorActual.empleado.colaCobro--;
            } else if (vectorAnterior.cliente2.estado === 4) {
              vectorActual.cliente2.estado = 5;
              vectorActual.proximoFinCobro = vectorActual.reloj + 0.25;
              vectorActual.empleado.estado = 1;
              vectorActual.empleado.colaCobro--;
            } else if (vectorAnterior.cliente3.estado === 4) {
              vectorActual.cliente3.estado = 5;
              vectorActual.proximoFinCobro = vectorActual.reloj + 0.25;
              vectorActual.empleado.estado = 1;
              vectorActual.empleado.colaCobro--;
            } else if (vectorAnterior.cliente4.estado === 4) {
              vectorActual.cliente4.estado = 5;
              vectorActual.proximoFinCobro = vectorActual.reloj + 0.25;
              vectorActual.empleado.estado = 1;
              vectorActual.empleado.colaCobro--;
            } else if (vectorAnterior.cliente5.estado === 4) {
              vectorActual.cliente5.estado = 5;
              vectorActual.proximoFinCobro = vectorActual.reloj + 0.25;
              vectorActual.empleado.estado = 1;
              vectorActual.empleado.colaCobro--;
            }
          }
          break;

        default:
          break;
      }

      //Buscar el proximo evento, creo una variable auxiliar para obtener que evento tiene el valor mas chico
      var minimo = vectorActual.proximaLlegada;
      var proximoEvento = 1;
      if (
        minimo >= vectorActual.proximaACabina &&
        vectorActual.proximaACabina !== 0
      ) {
        minimo = vectorActual.proximaACabina;
        proximoEvento = 2;
      }
      if (
        minimo >= vectorActual.finLlamadaCabina1 &&
        vectorActual.finLlamadaCabina1 !== 0
      ) {
        minimo = vectorActual.finLlamadaCabina1;
        proximoEvento = 3;
      }
      if (
        minimo >= vectorActual.finLlamadaCabina2 &&
        vectorActual.finLlamadaCabina2 !== 0
      ) {
        minimo = vectorActual.finLlamadaCabina2;
        proximoEvento = 4;
      }
      if (
        minimo >= vectorActual.proximoFinCobro &&
        vectorActual.proximoFinCobro !== 0
      ) {
        minimo = vectorActual.proximoFinCobro;
        proximoEvento = 5;
      }
      //Calcular AC de Caja Neta (restando 0.5 por cada cliente perdido)
      vectorActual.acCajaNeta =
        vectorActual.acIngresos - vectorActual.acClientesNoAtendidos * 0.5;
      //Calcular Max Cola de Caja
      if (
        vectorActual.empleado.colaCobro + vectorActual.empleado.colaAsignacion >
        vectorActual.maxColaCaja
      ) {
        vectorActual.maxColaCaja =
          vectorActual.empleado.colaCobro +
          vectorActual.empleado.colaAsignacion;
      }
      //Colocar los vectores que se encuentren dentro del rango de muestra
      if (i >= desde && i <= hasta) {
        //Pasar el número de evento a string
        let vectorTemp = vectorActual;
        switch (vectorTemp.evento) {
          case 0:
            vectorTemp.evento = "Inicializacion";
            break;
          case 1:
            vectorTemp.evento = "Llegada Cliente";
            break;
          case 2:
            vectorTemp.evento = "Fin Asignación";
            break;
          case 3:
            vectorTemp.evento = "Fin Llamada C1";
            break;
          case 4:
            vectorTemp.evento = "Fin llamada C2";
            break;
          case 5:
            vectorTemp.evento = "Fin Cobro";
            break;
          default:
            break;
        }
        vectores.push(JSON.parse(JSON.stringify(vectorTemp)));
      }
      vectorAnterior = vectorActual;
      vectorActual.evento = proximoEvento;
    }
    //Creacion del Vector de Fin de Simulación
    vectorActual.evento = "Fin Simulación";
    vectorActual.randLlegada = 0;
    vectorActual.tEntreLlegada = 0;
    vectorActual.proximaLlegada = 0;
    vectorActual.proximaACabina = 0;
    vectorActual.randDLlamada = 0;
    vectorActual.duracionLlamada = 0;
    vectorActual.finLlamadaCabina1 = 0;
    vectorActual.finLlamadaCabina2 = 0;
    vectorActual.proximoFinCobro = 0;
    vectorActual.empleado = {
      colaAsignacion: 0,
      colaCobro: 0,
      estado: 0,
    };
    vectorActual.cabina1 = 0;
    vectorActual.cabina2 = 0;
    vectorActual.cliente1 = {
      estado: 0,
      horaInicioLlamada: 0,
      horaFinLlamada: 0,
    };
    vectorActual.cliente2 = {
      estado: 0,
      horaInicioLlamada: 0,
      horaFinLlamada: 0,
    };
    vectorActual.cliente3 = {
      estado: 0,
      horaInicioLlamada: 0,
      horaFinLlamada: 0,
    };
    vectorActual.cliente4 = {
      estado: 0,
      horaInicioLlamada: 0,
      horaFinLlamada: 0,
    };
    vectorActual.cliente5 = {
      estado: 0,
      horaInicioLlamada: 0,
      horaFinLlamada: 0,
    };
    vectorActual.duracionLlamadaFinalizada = 0;
    vectorActual.costo = 0;
    vectores.push(JSON.parse(JSON.stringify(vectorActual)));
    //Seteo de Resultados
    setColaMaxCaja(vectorActual.maxColaCaja);
    setTotalDineroAcumulado(vectorActual.acIngresos);
    setGananciaNeta(vectorActual.acCajaNeta);
    setPPersonasNConsiCabina(
      getPorcentajeSinCabina(
        vectorActual.acClientes,
        vectorActual.acClientesNoAtendidos
      )
    );
    setTPromedioComunicaciones(
      getTPromedioLlamada(
        vectorActual.acCantidadLlamadas,
        vectorActual.acTiempoLlamadas
      )
    );
    setTableData(vectores);
    setIsLoading(false);
  };

  return (
    <div className="main-form">
      <Layout>
        <Layout.Header>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
            <Menu.Item key="1">Simulador de Cabinas Telefónicas</Menu.Item>
          </Menu>
        </Layout.Header>
      </Layout>
      <Row justify="center">
        <Col span={10}>
          <h3>
            <b>Parámetros</b>
          </h3>
          <Form layout="horizontal" {...layout} onFinish={onFinish}>
            <Form.Item
              label="Cantidad de Simulaciones"
              name="cantidad"
              rules={[
                {
                  required: true,
                  message: "Por favor introduce la cantidad de simulaciones",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Mostrar Desde"
              name="desde"
              rules={[
                {
                  required: true,
                  message: "Por favor introduce desde que linea desea mostrar",
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Mostrar Hasta"
              name="hasta"
              rules={[
                {
                  required: true,
                  message: "Por favor introduce hasta que linea desea mostrar",
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button htmlType="submit" loading={isLoading} type="primary">
                Simular
              </Button>
              <Button onClick={() => setShowModal(true)}>Enunciado</Button>
              <InfoCircleOutlined
                onClick={() => setShowInfo(true)}
                style={{ fontSize: "25px", color: "#08c", marginTop: "10px" }}
              />
            </Form.Item>
          </Form>
        </Col>
        <Col span={10}>
          <Descriptions title="Resultados de Simulación" column={1} bordered>
            <Descriptions.Item label="P() personas que no consiguen cabina">
              {pPersonasNConsiCabina.toLocaleString("es-ES")}
            </Descriptions.Item>
            <Descriptions.Item label="Cola Máxima en Caja">
              {colaMaxCaja.toLocaleString("es-ES")}
            </Descriptions.Item>
            <Descriptions.Item label="Tiempo Promedio de las comunicaciones (minutos)">
              {tPromedioComunicaciones.toLocaleString("es-ES")}
            </Descriptions.Item>
            <Descriptions.Item label="Total de Dinero Acumulado en Caja">
              {totalDineroAcumulado.toLocaleString("es-ES")}
            </Descriptions.Item>
            <Descriptions.Item label="Ganancia Neta">
              {gananciaNeta.toLocaleString("es-ES")}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={22}>
          <Table
            bordered
            size="small"
            scroll={{ x: "calc(2500px + 50%)", y: 600 }}
            dataSource={tableData}
          >
            <Table.Column
              title="Evento"
              dataIndex="evento"
              key="evento"
              fixed
              width={125}
            />
            <Table.Column
              title="Reloj"
              dataIndex="reloj"
              key="reloj"
              fixed
              render={(reloj) =>
                reloj.toLocaleString("es-ES", { maximumFractionDigits: 2 })
              }
            />
            <Table.Column
              title="RAND Llegada"
              dataIndex="randLlegada"
              key="randLlegada"
              render={(numero) =>
                numero.toLocaleString("es-ES", { maximumFractionDigits: 2 })
              }
            />
            <Table.Column
              title="Tiempo Entre Llegadas"
              dataIndex="tEntreLlegada"
              key="tEntreLlegada"
              render={(numero) =>
                numero.toLocaleString("es-ES", { maximumFractionDigits: 2 })
              }
            />
            <Table.Column
              title="Proxima Llegada"
              dataIndex="proximaLlegada"
              key="proximaLlegada"
              render={(numero) =>
                numero.toLocaleString("es-ES", { maximumFractionDigits: 2 })
              }
            />
            <Table.Column
              title="Proxima Asignacion Cabina"
              dataIndex="proximaACabina"
              key="proximaACabina"
              render={(numero) =>
                numero.toLocaleString("es-ES", { maximumFractionDigits: 2 })
              }
            />
            <Table.Column
              title="RAND Duracion Llamada"
              dataIndex="randDLlamada"
              key="randDLlamada"
              render={(numero) =>
                numero.toLocaleString("es-ES", { maximumFractionDigits: 2 })
              }
            />
            <Table.Column
              title="Duracion Llamada"
              dataIndex="duracionLlamada"
              key="duracionLlamada"
              render={(numero) =>
                numero.toLocaleString("es-ES", { maximumFractionDigits: 2 })
              }
            />
            <Table.Column
              title="Fin Llamada Cabina 1"
              dataIndex="finLlamadaCabina1"
              key="finLlamadaCabina1"
              render={(numero) =>
                numero.toLocaleString("es-ES", { maximumFractionDigits: 2 })
              }
            />
            <Table.Column
              title="Fin Llamada Cabina 2"
              dataIndex="finLlamadaCabina2"
              key="finLlamadaCabina2"
              render={(numero) =>
                numero.toLocaleString("es-ES", { maximumFractionDigits: 2 })
              }
            />
            <Table.Column
              title="Proximo Fin Cobro"
              dataIndex="proximoFinCobro"
              key="proximoFinCobro"
              render={(numero) =>
                numero.toLocaleString("es-ES", { maximumFractionDigits: 2 })
              }
            />
            <Table.ColumnGroup title="Empleado">
              <Table.Column
                title="Cola Asignacion"
                dataIndex="empleado"
                key="empleado"
                render={(empleado) => {
                  return empleado.colaAsignacion;
                }}
              />
              <Table.Column
                title="Cola Cobro"
                dataIndex="empleado"
                key="empleado"
                render={(empleado) => {
                  return empleado.colaCobro;
                }}
              />
              <Table.Column
                title="Estado"
                dataIndex="empleado"
                key="empleado"
                render={(empleado) => {
                  return empleado.estado;
                }}
              />
            </Table.ColumnGroup>
            <Table.Column title="Cabina 1" dataIndex="cabina1" key="cabina1" />
            <Table.Column title="Cabina 2" dataIndex="cabina2" key="cabina2" />
            <Table.ColumnGroup title="Cliente 1">
              <Table.Column
                title="Estado"
                dataIndex="cliente1"
                key="cliente1"
                render={(cliente) => {
                  return cliente.estado;
                }}
              />
              <Table.Column
                title="Hora Inicio Llamada"
                dataIndex="cliente1"
                key="cliente1"
                render={(cliente) => {
                  return cliente.horaInicioLlamada.toLocaleString("es-ES", {
                    maximumFractionDigits: 2,
                  });
                }}
              />
              <Table.Column
                title="Hora Fin Llamada"
                dataIndex="cliente1"
                key="cliente1"
                render={(cliente) => {
                  return cliente.horaFinLlamada.toLocaleString("es-ES", {
                    maximumFractionDigits: 2,
                  });
                }}
              />
            </Table.ColumnGroup>
            <Table.ColumnGroup title="Cliente 2">
              <Table.Column
                title="Estado"
                dataIndex="cliente2"
                key="cliente2"
                render={(cliente) => {
                  return cliente.estado;
                }}
              />
              <Table.Column
                title="Hora Inicio Llamada"
                dataIndex="cliente2"
                key="cliente2"
                render={(cliente) => {
                  return cliente.horaInicioLlamada.toLocaleString("es-ES", {
                    maximumFractionDigits: 2,
                  });
                }}
              />
              <Table.Column
                title="Hora Fin Llamada"
                dataIndex="cliente2"
                key="cliente2"
                render={(cliente) => {
                  return cliente.horaFinLlamada.toLocaleString("es-ES", {
                    maximumFractionDigits: 2,
                  });
                }}
              />
            </Table.ColumnGroup>
            <Table.ColumnGroup title="Cliente 3">
              <Table.Column
                title="Estado"
                dataIndex="cliente3"
                key="cliente3"
                render={(cliente) => {
                  return cliente.estado;
                }}
              />
              <Table.Column
                title="Hora Inicio Llamada"
                dataIndex="cliente3"
                key="cliente3"
                render={(cliente) => {
                  return cliente.horaInicioLlamada.toLocaleString("es-ES", {
                    maximumFractionDigits: 2,
                  });
                }}
              />
              <Table.Column
                title="Hora Fin Llamada"
                dataIndex="cliente3"
                key="cliente3"
                render={(cliente) => {
                  return cliente.horaFinLlamada.toLocaleString("es-ES", {
                    maximumFractionDigits: 2,
                  });
                }}
              />
            </Table.ColumnGroup>
            <Table.ColumnGroup title="Cliente 4">
              <Table.Column
                title="Estado"
                dataIndex="cliente4"
                key="cliente4"
                render={(cliente) => {
                  return cliente.estado;
                }}
              />
              <Table.Column
                title="Hora Inicio Llamada"
                dataIndex="cliente4"
                key="cliente4"
                render={(cliente) => {
                  return cliente.horaInicioLlamada.toLocaleString("es-ES", {
                    maximumFractionDigits: 2,
                  });
                }}
              />
              <Table.Column
                title="Hora Fin Llamada"
                dataIndex="cliente4"
                key="cliente4"
                render={(cliente) => {
                  return cliente.horaFinLlamada.toLocaleString("es-ES", {
                    maximumFractionDigits: 2,
                  });
                }}
              />
            </Table.ColumnGroup>
            <Table.ColumnGroup title="Cliente 5">
              <Table.Column
                title="Estado"
                dataIndex="cliente5"
                key="cliente5"
                render={(cliente) => {
                  return cliente.estado;
                }}
              />
              <Table.Column
                title="Hora Inicio Llamada"
                dataIndex="cliente5"
                key="cliente5"
                render={(cliente) => {
                  return cliente.horaInicioLlamada.toLocaleString("es-ES", {
                    maximumFractionDigits: 2,
                  });
                }}
              />
              <Table.Column
                title="Hora Fin Llamada"
                dataIndex="cliente5"
                key="cliente5"
                render={(cliente) => {
                  return cliente.horaFinLlamada.toLocaleString("es-ES", {
                    maximumFractionDigits: 2,
                  });
                }}
              />
            </Table.ColumnGroup>
            <Table.Column
              title="Duracion Llamada Finalizada"
              dataIndex="duracionLlamadaFinalizada"
              key="duracionLlamadaFinalizada"
              render={(numero) =>
                numero.toLocaleString("es-ES", { maximumFractionDigits: 2 })
              }
            />
            <Table.Column
              title="Costo"
              dataIndex="costo"
              key="costo"
              render={(numero) =>
                numero.toLocaleString("es-ES", { maximumFractionDigits: 2 })
              }
            />
            <Table.Column
              title="AC Clientes"
              dataIndex="acClientes"
              key="acClientes"
              render={(numero) =>
                numero.toLocaleString("es-ES", { maximumFractionDigits: 2 })
              }
            />
            <Table.Column
              title="AC Clientes no Atendidos"
              dataIndex="acClientesNoAtendidos"
              key="acClientesNoAtendidos"
              render={(numero) =>
                numero.toLocaleString("es-ES", { maximumFractionDigits: 2 })
              }
            />
            <Table.Column
              title="Max Cola Caja"
              dataIndex="maxColaCaja"
              key="maxColaCaja"
              render={(numero) =>
                numero.toLocaleString("es-ES", { maximumFractionDigits: 2 })
              }
            />
            <Table.Column
              title="AC Tiempo Llamadas"
              dataIndex="acTiempoLlamadas"
              key="acTiempoLlamadas"
              render={(numero) =>
                numero.toLocaleString("es-ES", { maximumFractionDigits: 2 })
              }
            />
            <Table.Column
              title="AC Cantidad Llamadas"
              dataIndex="acCantidadLlamadas"
              key="acCantidadLlamadas"
              render={(numero) =>
                numero.toLocaleString("es-ES", { maximumFractionDigits: 2 })
              }
            />
            <Table.Column
              title="AC Ingresos"
              dataIndex="acIngresos"
              key="acIngresos"
              render={(numero) =>
                numero.toLocaleString("es-ES", { maximumFractionDigits: 2 })
              }
            />
            <Table.Column
              title="AC Ingresos Netos"
              dataIndex="acCajaNeta"
              key="acCajaNeta"
              render={(numero) =>
                numero.toLocaleString("es-ES", { maximumFractionDigits: 2 })
              }
            />
          </Table>
        </Col>
      </Row>
      <Row justify="center" align="middle">
        <h3>Simulador desarrollado por Francisco Barafani</h3>
      </Row>
      <Modal
        visible={showModal}
        title="Enunciado - Cabinas Telefónicas"
        onOk={() => setShowModal(false)}
        onCancel={() => setShowModal(false)}
        width={800}
      >
        <p>
          A un pequeño locutorio telefónico llegan personas (con una
          distribución exponencial negativa) 10 personas por hora.
        </p>
        <p>
          {" "}
          A medida que iban entrando el empleado les asignaba una cabina
          (demoraba 10”). Como solo había 2 cabinas en ese locutorio, las
          personas que llegaron y se encontraron con que todo estaba ocupado se
          retiraban del locutorio.
        </p>
        <p> Las personas demoran hablando 52 minutos (uniforme).</p>
        <p>
          Cuando terminaban de hablar, se dirigían a pagar la tarifa. Como el
          locutorio tiene la promoción de 50 centavos para llamadas de hasta 5
          minutos y de ahí en adelante 2 centavos fraccionado cada 10 segundos.
        </p>
        <p>
          El empleado demoraba 15 segundos en cobrar a cada persona, y se
          lamentaba por los 50 centavos que consideraba perdidos por cada
          persona que no encontraba cabina.
        </p>
        <p>
          {" "}
          En las tareas del empleado tiene prioridad asignar cabina al cobro,
          pero no interrumpe ninguna de las dos. Se necesita saber:
        </p>
        <ul>
          <li> a) Porcentaje de personas que no consiguen cabina.</li>
          <li> b) Cola máxima en caja.</li>
          <li>c) Tiempo promedio de las comunicaciones.</li>
          <li>d)Total de dinero acumulado en caja.</li>
          <li>e)Ganancia neta considerando el costo de perder clientes.</li>
        </ul>
      </Modal>
      <Modal
        visible={showInfo}
        onOk={() => setShowInfo(false)}
        onCancel={() => setShowInfo(false)}
      >
        <h4>Resolución del Enunciado</h4>
        <p>Eventos:</p>
        <ul>
          <li>Llegada-Cliente - EXP(6) - X = -6 * LN(1 - RAND)</li>
          <li>Asignación-Cabina - cte 10" - a minutos = 0,16' </li>
          <li>Fin-Llamada - (5+-2') - U(3;7) - X = 3 + RAND*4</li>
          <li>Fin-Cobro - cte 15" - a minutos = 0,25'</li>
        </ul>
        <p>Objetos:</p>
        <ul>
          <li>
            Cliente( temporal, estados: 0 No creado, 1 Siendo Asignado, 21
            Llamada Cab 1, 22 Llamada Cab2 , 3 En cola Asignación, 4 en cola
            Cobro, 5 Abonando)
          </li>
          <li>Empleado(Permanente, n =1, estados: 0 Libre, 1 Ocupado)</li>
          <li>Cabina(Permanente, n = 2, estados: 0 Libre, 1 Ocupado)</li>
        </ul>
        <p>Colas:</p>
        <ul>
          <li>Cola de Asignación: Tipo FIFO</li>
          <li>
            Cola de Cobro: Tipo FIFO,la cola de asignación tiene prioridad sobre
            esta.
          </li>
          <li>
            Se considero para el calculo de maxima cola en caja la suma de ambas
            colas en un instante de tiempo.
          </li>
        </ul>
      </Modal>
    </div>
  );
}

//Funciones
//Duracion de la llamada -> Distribucion Uniforme(5;2)
function getDuracionLlamada(rand) {
  return 3 + rand * 4;
}
//Distribucion Exponencial Negativa (6);
function getLlegadaCliente(rand) {
  return -6 * Math.log(1 - rand);
}
//Calculador de Costo de llamada
function getCostoLlamada(duracion) {
  if (duracion < 5) {
    return 0.5;
  } else {
    const exceso = duracion - 5;
    var costoExceso = (Math.round((exceso * 60) / 10) * 2) / 100;
    return costoExceso + 0.5;
  }
}
//Calculador de Porcentaje de personas que no consiguen cabina
function getPorcentajeSinCabina(totalClientes, clientesNoAtendidos) {
  return clientesNoAtendidos / totalClientes;
}
//Calculador de Tiempo Promedio de Llamada
function getTPromedioLlamada(cantidadLlamadas, acTiempoLlamadas) {
  return acTiempoLlamadas / cantidadLlamadas;
}
