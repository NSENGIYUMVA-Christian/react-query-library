import { useQuery, useMutation , useQueryClient} from '@tanstack/react-query';
import customFetch from './utils';
import { toast } from "react-toastify"
// create our custom hook to get data from the server
export const useFetchTasks = ()=>{
    const {isLoading, data, isError, error} = useQuery(
        {
          queryKey: [`tasks`],
          queryFn: async () =>{
            const {data} = await customFetch.get(`/`)
            return data
          } 
        }
      )
    
      return {isLoading,isError,data}
}

//custom hook to post data in the server

export const useCreateTask = ()=>{
// invoke queryClient from the main.jsx
const queryClient = useQueryClient()

// useMutation is used for post/delete/update
  const {mutate: createTask, isLoading} = useMutation({
    mutationFn:(taskTitle)=> customFetch.post(`/`,{title:taskTitle}),
    onSuccess:()=>{
    queryClient.invalidateQueries({queryKey:[`tasks`]})
    toast.success(`task added`)

    },
    onError: (e)=>{
      toast.error(e.response.data.msg)
    }
 })

  return {createTask,isLoading}
}

//custom hook to edit data in the server
 
export const useEditTask = ()=>{
 // edit task
  const queryClient = useQueryClient()

 const {mutate:editTask} = useMutation({
    mutationFn: ({taskId,isDone})=> {
     return  customFetch.patch(`/${taskId}`,{isDone })
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:[`tasks`]})
    }
  })
  return {editTask}
}

//custom hook to post data in the server
 
export const useDeleteTask = ()=>{

   // delete task
   const queryClient = useQueryClient()

   const {mutate:deleteTask, isLoading:deleteTaskLoading } = useMutation({
    mutationFn: (taskId)=> {
     return  customFetch.delete(`/${taskId}`)
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:[`tasks`]})
    }
  })
 return {deleteTask,deleteTaskLoading}
}