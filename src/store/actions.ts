import { ActionContext } from 'vuex';
import { State } from './state';
import equipment from '../../data/equipment.json';
import equipmentModel from '../../data/equipmentModel.json';
import equipmentPositionHistory from '../../data/equipmentPositionHistory.json';
import equipmentState from '../../data/equipmentState.json';
import equipmentStateHistory from '../../data/equipmentStateHistory.json';
import * as icons from '../../icons/index';

export const actions = {
  populateFields(context: ActionContext<State, State>) {
    let equipHistory = new Array();
    equipment.find((eq: any) => {
      equipmentPositionHistory.find((eqPosH: any) => {
        if (eq.id == eqPosH.equipmentId) {
          equipHistory.push({
            id: eq.id,
            equipmentModelId: eq.equipmentModelId,
            codeName: eq.name,
            positions: eqPosH.positions.sort((a: any, b: any) => {
              return new Date(a.data).getTime() - new Date(b.data).getTime();
            })
          });
        }
      });
    });

    equipHistory = equipHistory.map((eqH: any) => {
      const model = equipmentModel.find(
        (eqM: any) => eqH.equipmentModelId === eqM.id
      );
      if (model) {
        return {
          ...eqH,
          popularName: model.name,
          hourlyEarnings: model.hourlyEarnings
        };
      }
      return eqH;
    });

    equipHistory = equipHistory.map((eqH: any) => {
      const stateHistory = equipmentStateHistory.find(
        (eSH: any) => eqH.id === eSH.equipmentId
      );
      if (stateHistory) {
        return {
          ...eqH,
          state: stateHistory.states
        };
      }
      return eqH;
    });

    equipHistory = equipHistory.map((eqH: any) => {
      const stateHistory = equipmentStateHistory.find(
        (eSH: any) => eqH.id === eSH.equipmentId
      );
      if (stateHistory) {
        return {
          ...eqH,
          state: stateHistory.states
        };
      }
      return eqH;
    });

    equipHistory = equipHistory.map((eqH: any) => {
      let updatedStates = eqH.state.map((stateItem: any) => {
        const matchingState = equipmentState.find(
          (es: any) => es.id === stateItem.equipmentStateId
        );
        if (matchingState) {
          return {
            ...stateItem,
            status: matchingState.name,
            statusColor: matchingState.color
          };
        }

        return stateItem;
      });
      updatedStates = updatedStates.sort(function (a: any, b: any) {
        return new Date(a.data).getTime() - new Date(b.data).getTime();
      });

      return {
        ...eqH,
        state: updatedStates
      };
    });

    equipHistory = equipHistory.map((eqH: any) => {
      eqH.state = eqH.state.map((state: any) => {
        const matchingEarning = eqH.hourlyEarnings.find((h: any) => {
          return state.equipmentStateId === h.equipmentStateId;
        });

        if (matchingEarning) {
          return {
            ...state,
            value: matchingEarning.value
          };
        }

        return state;
      });

      return eqH;
    });

    context.commit('setDatabase', equipHistory);
  },
  async search(
    context: ActionContext<State, State>,
    payload: { selection: string; input: string }
  ) {
    const database = context.getters['getDatabase'];
    let equipment = new Array();
    const { selection, input } = payload;
    if (selection === 'model') {
      equipment = await database.find((model: any) => {
        if (model.codeName === input.trim()) {
          return model;
        }
      });
    }
    if (selection === 'state') {
      equipment = database.filter((item: any) => item.state[0].status == input);
    }
    if (selection === 'name') {
      equipment = database.filter((item: any) => item.popularName == input);
    }
    context.commit('setLastSearch', equipment);
    return equipment;
  },
  async initPositions(context: ActionContext<State, State>) {
    const database = await context.getters['getDatabase'];
    let equipmentAndPosition = new Array();
    database.forEach(async (element: any) => {
      let icons = await context.dispatch('colorIcon', element);
      equipmentAndPosition.push({
        equipmentModel: element.codeName,
        equipmentName: element.popularName,
        status: element.state[0].status,
        statusColor: element.state[0].statusColor,
        lat: element.positions[0].lat,
        lng: element.positions[0].lon,
        icon: String(icons)
      });
    });
    return equipmentAndPosition;
  },
  colorIcon(context: ActionContext<State, State>, database: any) {
    let icon;

    if (database.popularName === 'Caminhão de carga') {
      if (database.state[0].status === 'Parado') {
        icon = icons.caminhaoParado;
      } else if (database.state[0].status === 'Operando') {
        icon = icons.caminhaoOperando;
      } else if (database.state[0].status === 'Manutenção') {
        icon = icons.caminhaoManutencao;
      }
    } else if (database.popularName === 'Harvester') {
      if (database.state[0].status === 'Parado') {
        icon = icons.harvesterParado;
      } else if (database.state[0].status === 'Operando') {
        icon = icons.harvesterOperando;
      } else if (database.state[0].status === 'Manutenção') {
        icon = icons.harvesterManutencao;
      }
    } else if (database.popularName === 'Garra traçadora') {
      if (database.state[0].status === 'Parado') {
        icon = icons.garraParado;
      } else if (database.state[0].status === 'Operando') {
        icon = icons.garraOperando;
      } else if (database.state[0].status === 'Manutenção') {
        icon = icons.garraManutencao;
      }
    }

    return icon;
  }
};
