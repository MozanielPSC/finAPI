import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("Should be able to show an user profile", async () => {
    const user = await createUserUseCase.execute({
      name: "name",
      email: "email",
      password: "1"
    });

    const user_id = user.id

    const result = await showUserProfileUseCase.execute(user_id as string);

    expect(result).toEqual(
      expect.objectContaining({
        id: result.id,
        name: "name",
        email: "email",
        password: result.password,
      }),
    );
  });

  it("Should not be able to show an nonexistent user profile", async () => {

    const user_id = "1"

    await expect(
      showUserProfileUseCase.execute(user_id)
    ).rejects.toEqual(new ShowUserProfileError());
  });
});
