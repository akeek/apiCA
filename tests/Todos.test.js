const express = require('express');
const request = require('supertest');
const URL = 'http://localhost:3000';
const bodyParser = require("body-parser");

describe('Todos API', () => {
  let token;
  test('POST /login - success', async () => {
    const credentials = { email: 'ek@yahoo.com', password: '1234' };
    const { body } = await request(URL)
    .post('/login')
    .send(credentials);

    expect(body).toHaveProperty('data');
    expect(body.data).toHaveProperty('token');
    token = body.data.token;
  });

  test('GET /todos - success', async () => {
    expect(token).toBeDefined();

    const response = await request(URL)
      .get('/todos')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data.data)).toBe(true);
  });

  test('POST /todos - success', async () => {
    expect(token).toBeDefined();

    const newTodo = {
      name: 'Play golf',
      description: '18 holes on Pebble beach',
      categoryId: '1', 
      statusId: '1',
      userId: '1'
    };

    const response = await request(URL)
      .post('/todos')
      .set('Authorization', `Bearer ${token}`)
      .send(newTodo);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('data');
    expect(response.body.data.data.name).toBe(newTodo.name);
    expect(response.body.data.data.description).toBe(newTodo.description);
    expect(response.body.data.data.categoryId).toBe(newTodo.CategoryId);
    expect(response.body.data.data.statusId).toBe(newTodo.StatusId);
    expect(response.body.data.data.userId).toBe(newTodo.UserId);

    const createdTodo = response.body.data.data;
    createdTodoId = createdTodo.id;
  });

  test('DELETE /todos/:id - success', async () => {
    expect(token).toBeDefined();
    expect(createdTodoId).toBeDefined();

    const response = await request(URL)
      .delete(`/todos/${createdTodoId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('message');
    expect(response.body.data.message).toBe('Todo marked as deleted successfully.');
  });


  test('GET /todos - fail', async () => {
    token = ''

    const response = await request(URL)
      .get('/todos')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('statusCode');
    expect(response.body.data).toHaveProperty('result');
    expect(response.body.data.result).toBe('No token provided');
  });

  test('GET /todos - fail', async () => {
    token = '123'

    const response = await request(URL)
      .get('/todos')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('status');
    expect(response.body.status).toBe('error');
    expect(response.body).toHaveProperty('result');
    expect(response.body.result).toBe('Invalid token');
  });
});