import { ActionContext } from 'vuex';
import {State } from './state';
import equipment from "../../data/equipment.json"
import equipmentModel from "../../data/equipmentModel.json"
import equipmentPositionHistory from "../../data/equipmentPositionHistory.json"
import equipmentState from "../../data/equipmentState.json"
import equipmentStateHistory from "../../data/equipmentStateHistory.json"
  
export const actions ={
    populateFields(context:ActionContext<State,State>){
        let equipHistory = new Array();
        equipment.find((eq: any)=>{
                equipmentPositionHistory.find((eqPosH:any)=>{
                   if(eq.id == eqPosH.equipmentId){
                        equipHistory.push({
                            id: eq.id,
                            equipmentModelId: eq.equipmentModelId,
                            codeName: eq.name,
                            positions:  eqPosH.positions.sort((a: any, b: any) => {
                                return new Date(a.data).getTime() - new Date(b.data).getTime();
                            })

                   } ) 
                }

        })  
    })

        equipHistory = equipHistory.map((eqH: any) => {
            const model = equipmentModel.find((eqM: any) => eqH.equipmentModelId === eqM.id);
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
            const stateHistory = equipmentStateHistory.find((eSH: any) => eqH.id === eSH.equipmentId);
            if (stateHistory) {
                return {
                    ...eqH,
                    state: stateHistory.states         
                };
            }
            return eqH;
        });

        equipHistory = equipHistory.map((eqH: any) => {
            const stateHistory = equipmentStateHistory.find((eSH: any) => eqH.id === eSH.equipmentId);
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
                const matchingState = equipmentState.find((es: any) => es.id === stateItem.equipmentStateId);
                if (matchingState) {
                    return {
                        ...stateItem,
                        status: matchingState.name,   
                        statusColor: matchingState.color 
                    }
                }
        
                return stateItem;
            })
            updatedStates = updatedStates.sort(function(a: any, b: any) {
                return new Date(a.data).getTime() - new Date(b.data).getTime();
            });
            
            return {
                ...eqH,
                state: updatedStates 
            }
        });
                
        context.commit("setDatabase",equipHistory)
    },
    async search(context:ActionContext<State,State>,payload: { selection: string, input: string }){
        const database = context.getters["getDatabase"]
        let equipment
        const { selection, input } = payload;
        if(selection === 'model'){
            equipment = await database.find((model:any)=>{
                return model.codeName === input
            })
        }
        context.commit("setLastSearch",JSON.parse(JSON.stringify(equipment)))
    },
    
}