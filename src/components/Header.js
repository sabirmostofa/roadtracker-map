import React from "react";
import { Link } from "gatsby";

import { useSiteMetadata } from "hooks";

import Container from "components/Container";

const Header = () => {
  const { companyName } = useSiteMetadata();

  return (
    <header>
      <Container type="content">
        <p>
          <Link to="/">{companyName}</Link>
        </p>
      </Container>
    </header>
  );
};

export default Header;
