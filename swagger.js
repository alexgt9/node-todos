import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

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
 *     CreateTodoBody:
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
 *         text: Go to the beach
 *         description: Try to go to the beach every friday
 *         completed: false
 *         tags: [beach, happy]
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the todo
 *         username:
 *           type: string
 *           description: The username must be unique
 *         password:
 *           type: string
 *           description: The user password
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the todo was added
 *       example:
 *         id: 911d7404-f927-46b8-bde9-759be745061d
 *         username: admin
 *         password: admin
 *         createdAt: 2020-03-10T04:05:06.157Z
 *     LoginBody:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: The username must be unique
 *         password:
 *           type: string
 *           description: The user password
 *       example:
 *         username: admin
 *         password: admin
 */
const options = (publicUrl) => {
    return {
        definition: {
        openapi: "3.0.0",
        info: {
            title: "Simple todos API",
            version: "0.1.0",
            description: "This is a simple CRUD API to manage todos.  The user 'aleh' contains some examples. The information stored in this API is not persistent. It will be deleted from time to time.",
        },
        servers: [
            {
            url: publicUrl,
            },
        ],
        },
        apis: ["./app.js", "./swagger.js"],
    }
};

export function swaggerMiddleware(app, publicUrl) {
    const specs = swaggerJsdoc(options(publicUrl));

    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(specs, { 
          customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.6.2/swagger-ui.css',
        } )
    );
}