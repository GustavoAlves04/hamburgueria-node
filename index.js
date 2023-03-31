const express = require("express");
const uuid = require("uuid");

const app = express();
app.use(express.json());
const port = 3000;

const orders = [];

const requestMethodAndRequestUrl = (request, response, next) => {
  const methodRequest = request.method;
  const url = request.url;

  console.log(`[${methodRequest}] ${url}`);
  next();
};
const checkId = (request, response, next) => {
  const { id } = request.params;
  const index = orders.findIndex((user) => user.id === id);
  if (index < 0) {
    return response.status(404).json({ error: "Order not found" });
  }
  request.orderId = id;
  request.orderIndex = index;

  next();
};

app.get("/order", requestMethodAndRequestUrl, (request, response) => {
  return response.json(orders);
});

app.post("/order", requestMethodAndRequestUrl, (request, response) => {
  const { order, clientName, price } = request.body;
  const user = {
    id: uuid.v4(),
    order,
    clientName,
    price,
    status: "Em preparação",
  };

  orders.push(user);
  return response.status(201).json({ user });
});

app.put(
  "/order/:id",
  checkId,
  requestMethodAndRequestUrl,
  (request, response) => {
    const { order, clientName, price } = request.body;
    const index = request.orderIndex;
    const id = request.orderId;

    const updateOrder = {
      id,
      order,
      clientName,
      price,
      status: "Em preparação",
    };
    orders[index] = updateOrder;

    return response.json(updateOrder);
  }
);

app.delete("/order/:id", requestMethodAndRequestUrl, (request, response) => {
  const index = request.orderIndex;

  orders.splice(index, 1);
  return response.status(204).json(orders);
});

app.get('/order/:id', checkId, requestMethodAndRequestUrl, (request, response) => {
    const index = request.orderIndex

    return response.status(200).json(orders[index])
})

app.patch('/order/:id', checkId, requestMethodAndRequestUrl, (request, response) => {
    const id = request.orderId
    const index = request.orderIndex
    const orderStatus = orders.filter(st => {
        if (st.id === id) {
            st.status = "pronto"
            let alterOrder = {
                id: id,
                order: st.order,
                clienteName: st.clienteName,
                price: st.price,
                status: st.status
            }
            return alterOrder
        }
    })

    orders[index] = orderStatus

    return response.status(200).json({ orderStatus })
})

app.listen(port);
