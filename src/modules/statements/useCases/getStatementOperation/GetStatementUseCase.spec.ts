import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase

describe("Statement", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository,);
        getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository,);
    });

    it("Should be able to get a statement", async () => {
        const user = await createUserUseCase.execute({
            name: "name",
            email: "email",
            password: "1"
        });

        const statement = await createStatementUseCase.execute({
            user_id: user.id as string,
            amount: 4000,
            description: 'income',
            type: 'deposit' as OperationType,
        })

        const result = await getStatementOperationUseCase.execute({
            user_id: statement.user_id,
            statement_id: statement.id as string,
        })

        expect(result).toEqual(
            expect.objectContaining({
                id: result.id,
                user_id: result.user_id,
                type: result.type,
                amount: result.amount,
                description: result.description,
            })
        );
    });

    it("Should not be able to get a nonexistent user statement", async () => {

        await expect(
            getStatementOperationUseCase.execute({
                user_id: '1',
                statement_id: '2',
            })
        ).rejects.toEqual(new GetStatementOperationError.UserNotFound());
    });

    it("Should not be able to get a nonexistent statement", async () => {

        const user = await createUserUseCase.execute({
            name: "name",
            email: "email",
            password: "1"
        });

        await expect(
            getStatementOperationUseCase.execute({
                user_id: user.id as string,
                statement_id: '1',
            })
        ).rejects.toEqual(new GetStatementOperationError.StatementNotFound());
    });


});
