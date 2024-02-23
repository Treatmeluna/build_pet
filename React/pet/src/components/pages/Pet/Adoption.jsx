import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { useLocation } from "react-router-dom";

const Adoption = (goAnimal) => {

  const location = useLocation();
  const { noticeNo, careNm } = location.state;

    return (
        <Container className="panel" style={{ marginTop: "50px", width: "700px" }}>
        <Form>
          <Form.Group as={Form.Row} className="mb-3" controlId="formPlaintextPassword">
            <Form.Label column sm="2">
              신청자 이름
            </Form.Label>
            <Form.Control
              type="text"
              value={sessionStorage.getItem("name")}
              name="name"
            />
          </Form.Group>
          <Form.Group as={Form.Row} className="mb-3" controlId="formPlaintextPassword">
            <Form.Label column sm="2">
              전화번호
            </Form.Label>
            <Form.Control
              type="text"
              value={sessionStorage.getItem("tel")}
              name="tel"
            />
          </Form.Group>
          <Form.Group as={Form.Row} className="mb-3" controlId="formPlaintextPassword">
            <Form.Label column sm="2">
              주소
            </Form.Label>
            <Form.Control
              type="text"
              value={sessionStorage.getItem("address")}
              name="address"
            />
          </Form.Group>

          <Form.Group as={Form.Row} className="mb-3" controlId="formPlaintextPassword">
            <Form.Label column sm="2">
              공고번호
            </Form.Label>
            <Form.Control
              type="text"
              value={noticeNo}
              readOnly
            />
          </Form.Group>
          <Form.Group as={Form.Row} className="mb-3" controlId="formPlaintextPassword">
            <Form.Label column sm="2">
              관할 보호 센터
            </Form.Label>
            <Form.Control
              type="text"
              value={careNm}
              readOnly
            />
          </Form.Group>
          </Form>
       
          <Button variant="secondary"  type="submit" style={{ marginRight: "auto" }}>
              관할센터에 신청서 보내기
            </Button>
          
          </Container>
    )
}

export default Adoption;