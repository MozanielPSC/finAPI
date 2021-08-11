import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Balance", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
    });

    it("Should be able to get an user balance", async () => {
        const user = await createUserUseCase.execute({
            name: "name",
            email: "email",
            password: "1"
        });

        const result = await getBalanceUseCase.execute({ user_id: user.id as string })

        expect(result).toHaveProperty("balance");
        expect(result).toHaveProperty("statement");
    });


    it("Should not be able to get an non existing user balance", async () => {

        await expect(
            getBalanceUseCase.execute({
                user_id: '1'
            })
        ).rejects.toEqual(new GetBalanceError());
    });

});
