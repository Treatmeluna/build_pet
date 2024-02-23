import { useEffect, useState } from "react";
import '../../styles/Report.css';
import { Button, FormControl, FormGroup, Modal, Table } from "react-bootstrap";
import Pagination from "react-js-pagination";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "../Navigation/SideBar.jsx";
import Swal from "sweetalert2";

const ReportList = () => {
  
  const movePage = useNavigate();
  const [boardReports, setBoardReports] = useState([]);
  const [commentReports, setCommentReports] = useState([]);
  const [bPage, setBPage] = useState(1);
  const [cPage, setCPage] = useState(1);
  const [bTotalPages, setBTotalPages] = useState(0);
  const [cTotalPages, setCTotalPages] = useState(0);
  const [bTotalElements, setBTotalElements] = useState(0);
  const [cTotalElements, setCTotalElements] = useState(0);

  const [reportState, setReportState] = useState('boardReport');
  const [reportStatus, setReportStatus] = useState('no');
  const [show ,setShow] = useState(false);

  const [boardReport, setBoardReport] = useState({
    brid: '',
    b_reporter: '',
    b_reason: '',
    community: '',
    reportStatus: '',
    reportDate: ''
  })
  const [commentReport, setCommentReport] = useState({
    crid: '',
    c_reporter: '',
    c_reason: '',
    community: '',
    comment: '',
    reportStatus: '',
    reportDate: ''
  })

  const handleLogout = async () => {
    try {
      const response = await fetch('/logout', {
        method: 'POST'
      });

      if (response.ok) {
        console.log('로그아웃 성공');
        sessionStorage.clear();
        movePage("/");
      } else {
        console.error('로그아웃 실패');
      }
    } catch (error) {
      console.error('로그아웃 중 오류 발생', error);
    }
  };

  const fetchData = async() => {
    try {
      const bResponse = await fetch('/admin/boardReport');
      const cResponse = await fetch('/admin/commentReport');
      const bData = await bResponse.json();
      const cData = await cResponse.json();
      
      setBoardReports(bData.content);
      setBTotalElements(bData.totalElements);
      setBTotalPages(Math.ceil(bData.totalElements / 10));
      setCommentReports(cData.content);
      setCTotalElements(cData.totalElements);
      setCTotalPages(Math.ceil(cData.totalElements / 10));

      if(reportState === 'boardReport') {
        const filteredBR = bData.content.filter((report) => report.reportStatus === reportStatus);
        setBTotalElements(filteredBR.length);
        setBTotalPages(Math.ceil(filteredBR.length / 10));
      }

      if(reportState === 'commentReport') {
        const filteredCR = cData.content.filter((report) => report.reportStatus === reportStatus);
        setCTotalElements(filteredCR.length);
        setCTotalPages(Math.ceil(filteredCR.length / 10));
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      Swal.fire({
        icon: "warning",
        iconColor: "red",
        title: "응답이 없어 로그아웃 처리되었습니다.",
        confirmButtonColor:"#b80042"
      });
      handleLogout();
    }
  };
  
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [reportState, reportStatus, bPage, cPage]);

  const handleBPageChange = async(selectedPage) => {
    try{
      const currentPage = Math.max(selectedPage, 1);
      setBPage(currentPage);
      await fetchData();
    } catch(error) {
      console.error("페이지 변경 오류", error);
    }
  }

  const handleCPageChange = async(selectedPage) => {
    try{
      const currentPage = Math.max(selectedPage, 1);
      setCPage(currentPage);
      await fetchData();
    } catch(error) {
      console.error("페이지 변경 오류", error);
    }
  }

  const reportOpen = (id) => {
    
    reportState === 'boardReport'
    ?viewBoardReport(id)
    :viewCommentReport(id)
    
    setShow(true);
  }
  const reportClose = () => setShow(false);

  const { brid } = useParams();
  const viewBoardReport = (brid) => {
    fetch(`/admin/boardReport/view/${brid}`, {
      method: 'GET',
      headers: {
        'Content-type' : 'application/json'
      },
    })
    .then((resp) => {
      if (!resp.ok) {
        throw new Error(`Network response was not ok: ${resp.status}`);
      }
      return resp.json();
    })
    .then((data) => {
      setBoardReport((prevBoardReport) => ({
        ...prevBoardReport,
        brid: data.boardReport.br_id,
        b_reporter: data.boardReport.b_reporter,
        b_reason: data.boardReport.b_reason,
        community: data.boardReport.community,
        reportStatus: data.boardReport.reportStatus,
        reportDate: data.boardReport.reportDate
      }));
    })
  }
  
  const boardStausChange = (brid) => {
   fetch(`/admin/boardReport/status/${brid}`, {
    method: 'PUT',
    headers: {
      'Content-type' : 'application/json'
    },
   })
   .then(()=> {
    reportClose();
    window.location.reload();
   })
  }

  const { crid } = useParams(); //필요여부 확인
  const viewCommentReport = (crid) => {
    fetch(`/admin/commentReport/view/${crid}`, {
      method: 'GET',
      headers: {
        'Content-type' : 'application/json'
      },
    })
    .then((resp) => {
      if (!resp.ok) {
        throw new Error(`Network response was not ok: ${resp.status}`);
      }
      return resp.json();
    })
    .then((data) => {
      setCommentReport((prevCommentReport) => ({
        ...prevCommentReport,
        crid: data.commentReport.cr_id,
        c_reporter: data.commentReport.c_reporter,
        c_reason: data.commentReport.c_reason,
        community: data.commentReport.community,
        comment: data.commentReport.comment,
        reportStatus: data.commentReport.reportStatus,
        reportDate: data.commentReport.reportDate
      }));
    })
  }
  
  const commentStausChange = (crid) => {
   fetch(`/admin/commentReport/status/${crid}`, {
    method: 'PUT',
    headers: {
      'Content-type' : 'application/json'
    },
   })
   .then(()=> {
    reportClose();
    window.location.reload();
   })
  }

  return(
    <div className="flex-container" style={{display: 'flex'}}>
      <SideBar/>
      <div className="reports">
        <div className="rMenu">
          <Button onClick={()=>setReportState('boardReport')} style={reportState === 'boardReport'? {backgroundColor: '#B89E97', color: 'white', fontWeight:'500'} : {backgroundColor: 'transparent', color: 'black', border: '1px solid black'}}>게시글 신고내역</Button>
          <Button onClick={()=>setReportState('commentReport')} style={reportState === 'commentReport'? {backgroundColor: '#B89E97', color: 'white',fontWeight:'500'} : {backgroundColor: 'transparent', color: 'black', border: '1px solid black'}}>댓글 신고내역</Button>
        </div>
        <div className="rSubMenu" style={{float: 'right'}}>
          {
            reportStatus === 'no'
            ?<>
              <Button variant="dark" onClick={()=>setReportStatus('no')} style={{marginRight:'5px'}}>미처리</Button>
              <Button variant="outline-dark" onClick={()=>setReportStatus('yes')}>처리완료</Button>
            </>
            :
            <>
              <Button variant="outline-dark" onClick={()=>setReportStatus('no')} style={{marginRight:'5px'}}>미처리</Button>
              <Button variant="dark" onClick={()=>setReportStatus('yes')}>처리완료</Button>
            </>
          }
        </div>
        <div className="rboard">
          {
            reportState === 'boardReport'
            ?
              <div className="bReport">
                <Table bgcolor="transparent">
                  <thead>
                    <tr>
                      <th>신고번호</th>
                      <th>신고자</th>
                      <th>신고사유</th>
                      <th>신고일시</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      reportStatus === 'no'
                      ?
                      <>
                        {
                          boardReports
                          .filter((report) => report.reportStatus === "no")
                          .slice((bPage - 1) * 10, bPage * 10)
                          .map((report, index) => (
                            <tr key={index}>
                              <td>{report.br_id}</td>
                              <td>{report.b_reporter}</td>
                              <td onClick={()=>reportOpen(report.br_id)}>{report.b_reason}</td>
                              <td>{new Date(report.reportDate).toLocaleString()}</td>
                            </tr>
                            ))
                        }
                      </>
                      :
                      <>
                        {
                          boardReports
                          .filter((report) => report.reportStatus === "yes")
                          .slice((bPage - 1) * 10, bPage * 10)
                          .map((report, index) => (
                            <tr key={index}>
                              <td>{report.br_id}</td>
                              <td>{report.b_reporter}</td>
                              <td onClick={()=>reportOpen(report.br_id)}>{report.b_reason}</td>
                              <td>{new Date(report.reportDate).toLocaleString()}</td>
                            </tr>
                            ))
                        }
                      </>
                    }
                  </tbody>
                </Table>
                <Pagination activePage={bPage} itemsCountPerPage={10} totalItemsCount={parseInt(bTotalElements)} pageRangeDisplayed={5} prevPageText={"<"} nextPageText={">"} onChange={handleBPageChange}/>
              </div>
           :
              <div className="cReport">
                <Table>
                  <thead>
                    <tr>
                      <th>신고번호</th>
                      <th>신고자</th>
                      <th>신고사유</th>
                      <th>신고일시</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      reportStatus === 'no'
                      ?
                      <>
                        {
                          commentReports
                          .filter((report) => report.reportStatus === "no")
                          .slice((cPage - 1) * 10, cPage * 10)
                          .map((report, index) => (
                            <tr key={index}>
                              <td>{report.cr_id}</td>
                              <td>{report.c_reporter}</td>
                              <td onClick={()=>reportOpen(report.cr_id)}>{report.c_reason}</td>
                              <td>{new Date(report.reportDate).toLocaleString()}</td>
                            </tr>
                          ))
                        }
                      </>
                      :
                      <>
                        {
                          commentReports
                          .filter((report) => report.reportStatus === "yes")
                          .slice((cPage - 1) * 10, cPage * 10)
                          .map((report, index) => (
                            <tr key={index}>
                              <td>{report.cr_id}</td>
                              <td>{report.c_reporter}</td>
                              <td onClick={()=>reportOpen(report.cr_id)}>{report.c_reason}</td>
                              <td>{new Date(report.reportDate).toLocaleString()}</td>
                            </tr>
                          ))
                        }
                      </>
                    }
                  </tbody>
                </Table>
                <Pagination activePage={cPage} itemsCountPerPage={10} totalItemsCount={parseInt(cTotalElements)} pageRangeDisplayed={5} prevPageText={"<"} nextPageText={">"} onChange={handleCPageChange}/>
              </div>
          }
        </div>
        <div className="reportView">
          <Modal show={show} onHide={reportClose}>
            <Modal.Header closeButton>
              <Modal.Title>상세 신고 내역</Modal.Title>
            </Modal.Header>
              {
                reportState === 'boardReport'
                ?
                <>
                  <Modal.Body>
                    <FormGroup style={{border:'1px solid #d9d9d9', borderRadius:'5px', padding: '15px' ,resize: "none"}}>
                        <FormControl type="text" plaintext readOnly value={boardReport.community.writer} style={{ fontWeight: "bold" }}/>
                        <div className="ck-content" type="text" plaintext readOnly dangerouslySetInnerHTML={{__html: boardReport.community.content}} style={{ resize: "none" }}/>
                    </FormGroup>
                    <div className="reportContainer">
                      <FormControl className="arrow" type="text" plaintext readOnly value={"↳"}/>
                      <FormGroup className="reportView">
                        <FormControl type="text" plaintext readOnly value={boardReport.b_reporter} style={{ fontWeight: "bold" }}/>
                        <FormControl as="textarea" plaintext readOnly value={boardReport.b_reason} style={{ resize: "none" }} rows={5} minLength={10}/>
                        <FormControl type="text" plaintext readOnly value={new Date(boardReport.reportDate).toLocaleString()} style={{ color: 'gray'}}/>
                      </FormGroup>
                    </div>
                  </Modal.Body>
                  {
                    boardReport.reportStatus === "no"
                    ?
                    <Modal.Footer>
                      <Button variant="outline-dark" onClick={()=>movePage(`/community/view/${boardReport.community.bnum}`)}>원글가기</Button>
                      <Button variant="outline-dark" onClick={()=>boardStausChange(boardReport.brid)}>처리완료</Button>
                    </Modal.Footer>
                    :
                    <Modal.Footer>
                      <Button variant="outline-dark" disabled onClick={()=>movePage(`/community/view/${boardReport.community.bnum}`)}>원글가기</Button>
                      <Button variant="outline-dark" disabled onClick={()=>boardStausChange(boardReport.brid)}>처리완료</Button>
                    </Modal.Footer>
                  }
                </>
                :
                <>
                  <Modal.Body>
                    <FormGroup style={{border:'1px solid #d9d9d9', borderRadius:'5px', padding: '15px' ,resize: "none"}}>
                      <FormControl type="text" plaintext readOnly value={commentReport.comment.c_writer} style={{ fontWeight: "bold" }}/>
                      <FormControl as="textarea" plaintext readOnly value={commentReport.comment.c_content} style={{ resize: "none" }}/>
                      <FormControl type="text" plaintext readOnly value={new Date(commentReport.reportDate).toLocaleString()} style={{ color: 'gray'}}/>
                    </FormGroup>
                    <div className="reportContainer">
                      <FormControl className="arrow" type="text" plaintext readOnly value={"↳"}/>
                      <FormGroup className="reportView">
                        <FormControl type="text" plaintext readOnly value={commentReport.c_reporter} style={{ fontWeight: 'bold' }}/>
                        <FormControl as="textarea" plaintext readOnly value={commentReport.c_reason} style={{ resize: "none" }} rows={5} minLength={10}/>
                        <FormControl type="text" plaintext readOnly value={new Date(commentReport.reportDate).toLocaleString()} style={{ color: 'gray'}}/>
                      </FormGroup>
                    </div>
                  </Modal.Body>
                  {
                    commentReport.reportStatus === "no"
                    ?
                    <Modal.Footer>
                      <Button variant="outline-dark" onClick={()=>movePage(`/community/view/${commentReport.community.bnum}`)}>원글가기</Button>
                      <Button variant="outline-dark" onClick={()=>commentStausChange(commentReport.crid)}>처리완료</Button>
                    </Modal.Footer>
                    :
                    <Modal.Footer>
                      <Button variant="outline-dark" disabled onClick={()=>movePage(`/community/view/${commentReport.community.bnum}`)}>원글가기</Button>
                      <Button variant="outline-dark" disabled onClick={()=>commentStausChange(commentReport.crid)}>처리완료</Button>
                    </Modal.Footer>
                  }
                </>
              }
          </Modal>
        </div>
      </div>
      </div>
  )
}

export default ReportList;