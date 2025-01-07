import swaggerJsDocs from 'swagger-jsdoc'
import basicAuth from 'express-basic-auth'

import { helloSwagger } from './hello/swagger/hello.swagger'
import { API_HOST, API_PORT, API_PREFIX } from '../config/server.config'


export const auth = basicAuth({
    users: { 'user': 'user' },
    challenge: true,
    realm: 'Swagger API',
})

const options = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'MagicNet API',
        version: '1.0.0',
        description: 'MagicNet API',
      },
      servers: [
        {
          url: `http://${ API_HOST }:${ API_PORT }${ API_PREFIX }`,
        },
      ],
    },
    apis: ['./app/**/*.js', './app/**/*.ts'],
}

const specs: any = swaggerJsDocs( options )

specs.paths = {
  ...specs.paths,
  ...helloSwagger,
}

export default {
  auth,
  specs,
}
