export const initialStore=()=>{
  return{
    message: null,
    // AÑADIMOS 'view' al estado inicial, por defecto en 'infographic'
    view: 'infographic', 
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      }
    ]
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    // ¡AÑADIMOS ESTA ACCIÓN PARA CAMBIAR LA VISTA!
    case 'SET_VIEW':
        return {
            ...store,
            view: action.payload // El payload será 'info', 'form' o 'infographic'
        };

    case 'add_task':
      const { id,  color } = action.payload

      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };
    
    default:
      // Cambiamos el error a un console.error para no bloquear toda la app por una acción no manejada.
      console.error(`Unhandled action type: ${action.type}`);
      return store;
  }    
}