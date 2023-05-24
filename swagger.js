/**
 * @openapi
 * components:
 *   schemas:
 *     username:
 *       name: username
 *       type: string
 *       required: true
 *       description: The user ID. Each username contains an unique todo list.
 *       in: path
 *     todoId:
 *       name: id
 *       type: string
 *       required: true
 *       description: The todo ID
 *       in: path
 *     Todo:
 *       type: object
 *       required:
 *         - text
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the todo
 *         text:
 *           type: string
 *           description: The name of your todo
 *         description:
 *           type: string
 *           description: The todo description
 *         author:
 *           type: string
 *           description: The todo author
 *         completed:
 *           type: boolean
 *           description: If the TODO is done
 *         tags:
 *           type: array
 *           items:
 *              type: string
 *           description: The todo author
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the todo was added
 *       example:
 *         id: 911d7404-f927-46b8-bde9-759be745061d
 *         text: Go to the beach
 *         description: Try to go to the beach every friday
 *         completed: false
 *         author: aleh
 *         tags: [beach, happy]
 *         createdAt: 2020-03-10T04:05:06.157Z
 */