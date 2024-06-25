import { Container } from "./styles";

function TitleRow() {
  return (
    <Container>
      <p>
        Price <span>USD</span>
      </p>
      <p>
        Amount <span>SOL</span>
      </p>
      <p>
        Total <span>SOL</span>
      </p>
    </Container>
  );
}

export default TitleRow;
