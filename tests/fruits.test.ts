import app from "../src/index";
import supertest from "supertest";
import { createFruit } from "./factories/fruits.factory";
import httpStatus from "http-status";
import fruits from "../src/data/fruits";

const api = supertest(app)

beforeEach(() => fruits.length = 0)

describe("Fruits API POST /fruits", () => {
    it("should return 201 when inserting a fruit", async () => {
        const body = createFruit()
        const { status } = await api.post("/fruits").send(body)
        expect(status).toBe(httpStatus.CREATED)
        expect(fruits).toHaveLength(1)
        expect(fruits).toEqual(expect.arrayContaining([{ ...body, id: 1 }]))
    })

    it("should return 409 when inserting a fruit that is already registered", async () => {
        const fruit1 = createFruit()
        const fruit2 = createFruit(fruit1.name)
        await api.post("/fruits").send(fruit1)
        const { status } = await api.post("/fruits").send(fruit2)
        expect(status).toBe(httpStatus.CONFLICT)
    })

    it("should return 422 when inserting a fruit with data missing", async () => {
        const { status } = await api.post("/fruits").send({})
        expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
    })
})

describe("Fruits API GET /fruits", () => {
    it("shoud return 404 when trying to get a fruit by an id that doesn't exist", async () => {
        const { status } = await api.get("/fruits/99999999")
        expect(status).toBe(httpStatus.NOT_FOUND)
    })

    it("should return 400 when id param is present but not valid", async () => {
        const { status } = await api.get("/fruits/erro")
        expect(status).toBe(httpStatus.BAD_REQUEST)
    })

    it("should return one fruit when given a valid and existing id", async () => {
        const fruit = { id: fruits.length + 1, ...createFruit() }
        fruits.push(fruit)

        const { status, body } = await api.get(`/fruits/${fruit.id}`)
        expect(status).toBe(httpStatus.OK)
        expect(body.name).toBe(fruit.name)
    })

    it("should return all fruits if no id is present", async () => {
        const fruit1 = { id: fruits.length + 1, ...createFruit() }
        const fruit2 = { id: fruits.length + 1, ...createFruit() }
        fruits.push(fruit1, fruit2)

        const { status, body } = await api.get(`/fruits`)
        expect(status).toBe(httpStatus.OK)
        expect(body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
                price: expect.any(Number)
            })
        ]))
    })
})