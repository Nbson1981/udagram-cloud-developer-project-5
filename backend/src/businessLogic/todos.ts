import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'
import { TodoUpdate } from '../models/TodoUpdate';

// TODO: Implement businessLogic
const logger = createLogger('TodoAccess')
const attachmentUtils = new AttachmentUtils()
const todosAcess = new TodosAccess()

//Get todo logic function
export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    logger.info('Calling getTodos function')
    return todosAcess.getAllTodos(userId)
}

//Create todo logic function
export async function createTodo(
    newTodo: CreateTodoRequest,
    userId: string
): Promise<TodoItem> {
    logger.info('Calling Create Todo function')

    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
    
    const newItem = {
        userId,
        todoId,
        createdAt,
        done: false,
        attachmentUrl: '',
        ...newTodo
    }
return await todosAcess.createTodoItem(newItem)
}

//Update todo logic function
export async function updateTodo(     
    todoId: string,
    todoUpdate: UpdateTodoRequest,
    userId: string
    ): Promise<TodoUpdate> {
    logger.info('Calling update todo function')
    return todosAcess.updateTodoItem(todoId, userId, todoUpdate)           
    }

//Delete todo logic function
export async function deleteTodo(
    todoId: string,
    userId: string
    ): Promise<string> {
    logger.info('Calling delete todo function')
    return todosAcess.deleteTodoItem(todoId, userId)
    }

//Create attachment function logic
export async function createAttachmentPresignedUrl(
    todoId: string,
    userId: string    
    ): Promise<string> {
    logger.info('Calling create attachment function by user', userId, todoId)
    const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
    await todosAcess.updateAttachmentUrl(todoId, userId, s3AttachmentUrl)
    return attachmentUtils.getUploadUrl(todoId)    
}