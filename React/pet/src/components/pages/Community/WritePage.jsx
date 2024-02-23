import { useState } from "react";
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import '../../styles/Community.css';

const WritePage = ({ insertCommunity }) => {
    const movePage = useNavigate();

    const back = () => {
        movePage(-1);
    }

    const [formContent, setFormContent] = useState({
        b_category:'',
        b_title: '',
        b_content: '',
        b_writer: '',
    })

    const getValue = (e) => {
        setFormContent({
            ...formContent,
            [e.target.name] : e.target.value
        })
    }

    const communityInsert = async() => {
        if(!formContent.b_category.trim()){
            Swal.fire({
                icon: "warning",
                iconColor: "red",
                title: "카테고리를 선택해주세요.",
                confirmButtonColor:"#b80042"
            });
        }else if(!formContent.b_title.trim()){
            Swal.fire({
                icon: "warning",
                iconColor: "red",
                title: "제목을 입력해주세요.",
                confirmButtonColor:"#b80042"
            });
        }else if(formContent.b_title.trim().length>255){
            Swal.fire({
                icon: "warning",
                iconColor: "red",
                title: "제목 글자수를 확인해주세요.",
                confirmButtonColor:"#b80042"
            });
        }else if(!formContent.b_content){
            Swal.fire({
                icon: "warning",
                iconColor: "red",
                title: "내용을 입력해주세요.",
                confirmButtonColor:"#b80042"
        })
        }else if(formContent.b_content.length>2000){
            Swal.fire({
                icon: "warning",
                iconColor: "red",
                title: "글자수를 확인해주세요.",
                confirmButtonColor:"#b80042"
            })
        }else{
            try{
                await insertCommunity(formContent);
            } catch (error) {
                console.error('오류발생:', error);
            }
        } 
    }

    return(
        <div className="Editor">
        <p className="pTitle">빂Write빂</p>
        <div className="wboard">
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>CATEGORY</Form.Label>
                    <Form.Select name="b_category" value={formContent.b_category} onChange={getValue}>
                        <option value="" disabled defaultValue>==선택==</option>
                        {
                            sessionStorage.getItem("role") === "ROLE_ADMIN"
                            ?<option>공지사항</option>
                            :<option style={{ display:'none'}}>공지사항</option>
                        }
                        <option>질문</option>
                        <option>정보</option>
                        <option>후기</option>
                        <option>자랑</option>
                        <option>삽니다</option>
                        <option>팝니다</option>
                        <option>기타</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="b_title">
                    <Form.Label>TITLE</Form.Label>
                    <Form.Control type="text" name="b_title" value={formContent.b_title} onChange={getValue} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="b_writer">
                    <Form.Label>WRITER</Form.Label>
                    <Form.Control readOnly type="text" name="b_writer" value={sessionStorage.getItem("nickname")} onChange={getValue} />
                </Form.Group>
                <div className="ck-content">
                <CKEditor editor={ClassicEditor} id="b_content" data=""
                    config={{
                        language: 'ko',
                        placeholder: "내용을 입력해주세요.",
                        mediaEmbed: {
                            previewsInData: true
                        },
                        toolbar: {
                            items: [
                                'undo',
                                'redo',
                                'heading',
                                '|',
                                'fontSize',
                                'fontFamily',
                                'fontColor',
                                'fontBackgroundColor',
                                '|',
                                'bold',
                                'italic',
                                'highlight',
                                '|',
                                'numberedList',
                                'bulletedList',
                                'indent',
                                'outdent',
                                '|',
                                'link',
                                'blockQuote',
                                // 'imageUpload',
                                'insertTable',
                                'mediaEmbed',
                                '|',
                            ]
                        }
                    }}

                    onChange={(event, editor) => {
                       setFormContent({
                        ...formContent,
                        b_content: editor.getData(),
                        b_writer: sessionStorage.getItem("nickname")
                       });
                        // console.log({event,editor,formContent});
                    }}
                />
                </div>
                <div className="wBtns">
                    <Button onClick={communityInsert} style={{marginRight: 5, backgroundColor:"#1098f7", borderColor:"#1098f7"}}>등록</Button>
                    <Button style={{backgroundColor:"#828282", borderColor:"#828282"}} onClick={back}>취소</Button>
                </div>
            </Form>
        </div>
        </div>
    )
}

export default WritePage;