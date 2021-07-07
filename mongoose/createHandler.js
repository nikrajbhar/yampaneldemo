import nextConnect from 'next-connect';
import databaseMiddleware from './connection';
export default function createHandler(...middleware) {
    return nextConnect().use(databaseMiddleware, ...middleware);
}