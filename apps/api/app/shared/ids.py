import random
import string


def random_client_code_5() -> str:
    return f"{random.randint(0, 99999):05d}"


def random_str_4() -> str:
    alphabet = string.ascii_uppercase + string.digits
    return "".join(random.choice(alphabet) for _ in range(4))


def make_db_name(client_code: str) -> str:
    last4 = client_code[-4:]
    return f"{last4}_{random_str_4()}"
