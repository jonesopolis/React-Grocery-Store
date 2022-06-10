import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Profile from "../../pages/profile";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

jest.mock("next-auth/react");

it(`displays claims values`, () => {

  const mockSession: Session = {
    expires: "1",
    user: {
      aud: "",
      iss: "",
      iat: 0,
      nbf: 0,
      exp: 0,
      aio: "",
      email: "",
      family_name: "davy jones",
      given_name: "",
      idp: "",
      name: "",
      oid: "",
      preferred_username: "",
      rh: "",
      roles: [],
      sub: "",
      tid: "",
      uti: "",
      ver: 0,
    },
    account: {
      provider: "",
      type: "",
      providerAccountId: "",
      token_type: "",
      scope: "",
      expires_at: 0,
      ext_expires_in: 0,
      access_token: "",
      id_token: "",
      session_state: "",
    },
  };

  (useSession as jest.Mock).mockReturnValueOnce({ data: mockSession });

  render(<Profile />);

  expect(screen.getByText("davy jones")).toBeInTheDocument();
})

