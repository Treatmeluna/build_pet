import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Form, FormControl, FormGroup, FormLabel, Modal, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import '../../styles/Community.css';
import Swal from "sweetalert2";

const ViewPage = () => {

    const movePage = useNavigate();
    const prevBnum = useRef(null);
    const user = sessionStorage.getItem("nickname");

    const prev = () => {
        window.history.back();
    }

    const updateForm = () => {
        movePage(`/community/update`, { state: { viewData: view } });
    }
    const { bnum } = useParams();
    const [view, setView] = useState({
        b_category: '',
        b_title: '',
        b_content: '',
        b_writer: '',
        b_date: '',
        b_like: '',
        hitcount: '',
        bnum: ''
    })

    const [commentList, setCommentList] = useState([]);
    
    useEffect(() => {
        console.log("localStorage", localStorage);
        const viewList = () => {
            fetch(`/community/view/${bnum}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                },
            })
                .then((resp) => {
                    if (!resp.ok) {
                        throw new Error(`Network response was not ok: ${resp.status}`);
                    }
                    return resp.json();
                })
                .then((data) => {
                    console.log("data확인", data);
                    setView((prevView) => (
                        {
                            ...prevView,
                            b_category: data.community.b_category,
                            b_title: data.community.b_title,
                            b_content: data.community.b_content,
                            b_writer: data.community.b_writer,
                            b_date: data.community.b_date,
                            b_like: data.community.b_like,
                            hitcount: data.community.hitcount,
                            bnum: data.community.bnum
                        }));
                    if (data.comments) {
                        const initialState = data.comments.map((comment) => {
                            const cmtlikeStateFromLocalStorage = localStorage.getItem(`cmtLikeState-${comment.c_id}-${user}`);
                            return cmtlikeStateFromLocalStorage === 'true';
                        });
                        setCmtLikeStates(initialState);
                    }
                    setCommentList(data.comments);
                })
                .catch((error) => {
                    console.error('Fetch error:', error);
                    console.error('Response:', error.response);
                });
        }
        if (bnum !== prevBnum.current) {
            viewList();
            prevBnum.current = bnum;
        }
    }, [bnum]);

    const deleteBoard = () => {
        fetch(`/community/delete/${bnum}`, {
            method: 'DELETE',
        })
            .then(() => {
                window.location = '/community';
                // window.location = document.referrer;
            })
    }

    const likeStateFromLocalStorage = localStorage.getItem(`likeState-${bnum}-${user}`);
    const [likeState, setLikeState] = useState(
        likeStateFromLocalStorage === 'true'
    );

    const blike = () => {
        fetch(`/community/like/${bnum}`, {
            method: 'GET'
        })
            .then(() => {
                setLikeState((prevLikeState) => {
                    const newLikeState = !prevLikeState;
                    localStorage.setItem(`likeState-${bnum}-${user}`, String(newLikeState));
                    return newLikeState;
                });
                view.b_like ++;
            })
            .catch((error) => {
                console.error('Fetch error:', error);
                console.error('Response:', error.response);
            });
    }

    const [show, setShow] = useState(false);
    const reportClose = () => setShow(false);
    const reportOpen = () => setShow(true);
    const defaultReport = `상세내용을 작성해주세요.`;
    const [boardReport, setBoardReport] = useState({
        b_reporter: '',
        b_reason: '',
        b_id: bnum,
        reportStatus: ''
    });
    const getValue = (e) => {
        setBoardReport((prevBoardReport) => ({
            ...prevBoardReport,
            [e.target.name]: e.target.value
        }));
    }
    const reportSend = () => {
        const boardReportDTO = {
            b_reporter: sessionStorage.getItem("nickname"),
            b_reason: boardReport.b_reason,
            b_id: bnum,
            reportStatus:''
        };
        
        if(boardReport.b_reason.length>255){
            Swal.fire({
                icon: "warning",
                iconColor: "red",
                title: "글자수를 확인해주세요.",
                confirmButtonColor:"#b80042"
            })
        }else{
            fetch(`/community/report/${view.bnum}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(boardReportDTO)
            })
                .then((resp) => {
                    if (!resp.ok) {
                        throw new Error(`Network response was not ok: ${resp.status}`);
                    }
                    return resp.text();
                })
                .then((resp) => {
                    setBoardReport({
                        b_reporter: sessionStorage.getItem("nickname"),
                        b_reason: boardReportDTO.b_reason,
                        b_id: bnum,
                        reportStatus: ''
                    });
                    reportClose();
                })
            } 
        }

    const [formComment, setFormComment] = useState({
        c_writer: sessionStorage.getItem("nickname"),
        c_content: '',
        b_id: bnum
    })

    const getComment = (e) => {
        setFormComment((prevFormComment) => ({
            ...prevFormComment,
            [e.target.name]: e.target.value
        }))
    }

    const commentInsert = () => {
        if(!formComment.c_content.trim()){
            Swal.fire({
                icon: "warning",
                iconColor: "red",
                title: "댓글을 입력해주세요.",
                confirmButtonColor:"#b80042"
        })
        }else if(formComment.c_content.length>255){
            Swal.fire({
                icon: "warning",
                iconColor: "red",
                title: "글자수를 확인해주세요.",
                confirmButtonColor:"#b80042"
            })
        }else{
            const commentDTO = {
                c_writer: formComment.c_writer,
                c_content: formComment.c_content,
                b_id: bnum
            }
            fetch(`/comment/insert/${view.bnum}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(commentDTO)
            })
            .then(() => {
                setFormComment({
                    c_writer: '',
                    c_content: '',
                    b_id: bnum
                })
                window.location.reload();
            })
        }
    }

    const [cmtLikeStates, setCmtLikeStates] = useState(() => {
        const initialState = commentList.map((comment) => {
            const cmtlikeStateFromLocalStorage = localStorage.getItem(`cmtLikeState-${comment.c_id}-${user}`);
            return cmtlikeStateFromLocalStorage === 'true';
        });
        return initialState;
    });

    const clike = (c_id, index) => {
        fetch(`/comment/like/${c_id}`, {
            method: 'GET'
        })
            .then(() => {
                setCommentList((prevCommentList) => {
                    const updatedList = [...prevCommentList];
                    const updatedComment = { ...updatedList[index], c_like: updatedList[index].c_like + 1 };
                    console.log("updatedComment확인:", updatedComment)
                    updatedList[index] = updatedComment;
                    return updatedList;
                });

                setCmtLikeStates((prevCmtLikeState) => {
                    const newCmtLikeStates = [...prevCmtLikeState];
                    newCmtLikeStates[index] = true;
                    localStorage.setItem(`cmtLikeState-${c_id}-${user}`, 'true');
                    return newCmtLikeStates;
                })
            })
            .catch((error) => {
                console.error('Fetch error:', error);
                console.error('Response:', error.response);
            });
    }

    const deleteComment = (c_id) => {
        fetch(`/comment/delete/${c_id}`, {
            method: 'DELETE',
        })
        .then(() => {
            window.location.reload();
            // window.location = document.referrer;
        })
    }
    const [cShow, setCShow] = useState(false);
    const cReportClose = () => setCShow(false);
    const cReportOpen = (c_id) => {
        setCmtReport((prevCmtReport) => ({
            ...prevCmtReport,
            c_id: c_id
        }));
        setCShow(true);
    }
    const [cmtReport, setCmtReport] = useState({
        c_reporter: '',
        c_reason: '',
        c_id: 0
    });

    const defaultCmtReport = `상세내용을 작성해주세요.`;

    const cmtGetValue = (e) => {
        setCmtReport((prevCmtReport) => ({
            ...prevCmtReport,
            [e.target.name]: e.target.value
        }));
    }
    const cReportSend = () => {
        const commentReportDTO = {
            c_reporter: sessionStorage.getItem("name"),
            c_reason: cmtReport.c_reason,
            c_id: cmtReport.c_id
        };
        fetch(`/comment/report/${cmtReport.c_id}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(commentReportDTO)
        })
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error(`Network response was not ok: ${resp.status}`);
                }
                return resp.text();
            })
            .then((resp) => {
                setCmtReport({
                    c_reporter: '',
                    c_reason: '',
                    c_id: commentReportDTO.c_id
                });
                cReportClose();
            })
    }

    return (
        <>
            <div className="vboard">
                <Button variant="outline-secondary" style={{ marginBottom: 10 }} onClick={prev}>{`<-`}</Button>
                <Form>
                    <Form.Group className="mb-3" controlId="b_title">
                        <Form.Control plaintext readOnly type="text" name="b_title" value={view.b_title} style={{ fontSize: 30 }} />
                    </Form.Group>
                    <Row>
                        <Col>
                            <Form.Group style={{ borderRight: '1px gray solid' }} className="mb-3" controlId="b_writer">
                                <Form.Label>작성자</Form.Label>
                                <Form.Control plaintext readOnly type="text" name="b_writer" value={view.b_writer} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group style={{ borderRight: '1px gray solid' }} className="mb-3" controlId="b_date">
                                <Form.Label>등록일</Form.Label>
                                <Form.Control plaintext readOnly type="text" name="b_date" value={view.b_date} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group style={{ borderRight: '1px gray solid' }} className="mb-3" controlId="b_category">
                                <Form.Label>분류</Form.Label>
                                <Form.Control plaintext readOnly type="text" name="b_category" value={view.b_category} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="hitcount">
                                <Form.Label>조회수</Form.Label>
                                <Form.Control plaintext readOnly type="text" name="hitcount" value={view.hitcount} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className="ck-content" dangerouslySetInnerHTML={{__html: view.b_content}}></div>
                </Form>
                <div className="vBtns">
                    <div className="lBtn">
                        {
                            likeState === true || sessionStorage.length === 0
                                ? <Button id="bLiked">♥ 좋아요({view.b_like})</Button>
                                : <Button id="bLike" onClick={()=>blike()} >♥ 좋아요({view.b_like})</Button>
                        }
                        {
                            sessionStorage.length === 0 || view.b_category === "공지사항"
                            ?<Button id="lBtn2" style={{visibility:"hidden"}}>신고</Button>
                            :<Button id="lBtn2" onClick={reportOpen}>신고</Button>
                        }        
                    </div>
                    <div className="rBtn">
                        {
                            sessionStorage.getItem("nickname")===view.b_writer
                            ?<Button style={{ marginRight: 5, backgroundColor: "#1098f7", borderColor: "#1098f7" }} onClick={updateForm}>수정</Button>
                            :<Button style={{ marginRight: 5, backgroundColor: "#1098f7", borderColor: "#1098f7", visibility:"hidden"}} onClick={updateForm}>수정</Button>
                        }
                        {
                            sessionStorage.getItem("nickname")===view.b_writer || sessionStorage.getItem("role")==="ROLE_ADMIN"
                            ?<Button style={{ marginRight: 5, backgroundColor: "#b80042", borderColor: "#b80042" }} onClick={deleteBoard}>삭제</Button>
                            :<Button style={{ marginRight: 5, backgroundColor: "#b80042", borderColor: "#b80042", visibility:"hidden"}} onClick={deleteBoard}>삭제</Button>
                        }
                        
                    </div>
                </div>
                <div className="bReportModal">
                    <Modal show={show} onHide={reportClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>{view.bnum}번 글 신고</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <FormGroup className="mb-3">
                                <FormLabel>신고사유 :</FormLabel>
                                <input type="hidden" value={sessionStorage.getItem("nickname")} name="b_reporter" />
                                <FormControl as='textarea' value={boardReport.b_reason} style={{ resize: "none" }} rows={5} minLength={10} name='b_reason' placeholder={defaultReport} onChange={getValue}></FormControl>
                            </FormGroup>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button style={{ backgroundColor: "#828282", borderColor: "#828282" }} onClick={reportClose}>취소</Button>
                            <Button style={{ backgroundColor: "#1098f7", borderColor: "#1098f7" }} onClick={reportSend}>전송</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
                <div className="cmtboard" id="cmtboard">
                    <FormLabel style={{ fontWeight: "bold" }}>댓글 {commentList.length}</FormLabel>
                    <Form.Group className="cInsert">
                        <Form.Control type="text" plaintext readOnly id="c_writer" value={formComment.c_writer} style={{ fontWeight: "bold" }} name="c_writer" placeholder="작성자" onChange={getComment} />
                        <Form.Control as="textarea" plaintext id="c_content" value={formComment.c_content} style={{ resize: "none" }} name="c_content" placeholder="내용을 입력해주세요." onChange={getComment} />
                        <Button variant="outline-dark" style={{ display: 'block', marginLeft: 'auto' }} onClick={commentInsert}>작성</Button>
                    </Form.Group>
                    <hr />
                    <div className="cmtList">
                        {
                            commentList && commentList.map((comment, index) => (
                                <FormGroup className='cmt' key={index}>
                                    <Form.Control type="text" plaintext readOnly value={comment.c_writer} style={{ fontWeight: 'bold' }} />
                                    <Form.Control as="textarea" plaintext readOnly value={comment.c_content} style={{ resize: 'none' }} />
                                    <FormGroup className='cmtFooter'>
                                        {
                                            cmtLikeStates[index] === true || sessionStorage.length === 0
                                                ? <Button key={index} variant={cmtLikeStates[index] ? "dark" : "outline-dark"} size="sm" style={{ marginRight: '5px', cursor: 'default' }}>♥ 좋아요({comment.c_like})</Button>
                                                : <Button key={index} variant={cmtLikeStates[index] ? "dark" : "outline-dark"} size="sm" onClick={() => clike(comment.c_id, index)} style={{ marginRight: '5px' }}>♥ 좋아요({comment.c_like})</Button>
                                                }
                                        {
                                            sessionStorage.length === 0
                                            ?<Button style={{visibility: "hidden"}}>신고</Button>
                                            :<Button variant="outline-warning" size="sm" onClick={() => cReportOpen(comment.c_id)} style={{ marginRight: '5px' }}>신고</Button>
                                        }
                                        {
                                            sessionStorage.getItem("nickname")===comment.c_writer || sessionStorage.getItem("role")==="ROLE_ADMIN"
                                            ?<Button variant="outline-danger" size="sm" onClick={() => deleteComment(comment.c_id)}>삭제</Button>
                                            :<Button variant="outline-danger" size="sm" style={{visibility: "hidden"}}>삭제</Button>
                                        }
                                        <Form.Control type="date" plaintext readOnly value={comment.c_date} style={{ fontSize: '12px', color: "gray" }} />
                                    </FormGroup>
                                </FormGroup>
                            ))
                        }
                    </div>
                    <div className="cReportModal">
                        <Modal show={cShow} onHide={cReportClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>{cmtReport.c_id}번 댓글 신고</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <FormGroup className="mb-3">
                                    <FormLabel>신고사유 :</FormLabel>
                                    <input type="hidden" value={sessionStorage.getItem("nickname")} name="c_reporter" />
                                    <FormControl as='textarea' value={cmtReport.c_reason} style={{ resize: "none" }} rows={5} minLength={10} name='c_reason' placeholder={defaultCmtReport} onChange={cmtGetValue}></FormControl>
                                </FormGroup>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button style={{ backgroundColor: "#828282", borderColor: "#828282" }} onClick={cReportClose}>취소</Button>
                                <Button style={{ backgroundColor: "#1098f7", borderColor: "#1098f7" }} onClick={cReportSend}>전송</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewPage;
