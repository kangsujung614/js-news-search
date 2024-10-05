"use strict";

const searchInputNode = document.getElementById('search');
const buttonNode = document.getElementById('button');
const resultNode = document.getElementById('result');

// 원문 뉴스를 새 창으로 띄우는 함수(more 클릭 시 호출)
const moveSrcLink = (url, event) => {
    event.preventDefault(); // 화면 최상단 이동(href="#") 방지
    window.open(
        url,
        'blank_',
        'left=100,top=100,width=800,height=600'
    )
}

// search(검색) 버튼 클릭 시 이벤트 발생
buttonNode.addEventListener('click', () => {
    let xhr = new XMLHttpRequest();
    xhr.open('get',`https://newsapi.org/v2/everything?q=${searchInputNode.value}&apiKey=b3a3db3e381141a98b2892b8b384ba95`, true);

    xhr.onload = function() {
        let result = xhr.responseText;
        let resultObj = JSON.parse(result);
        let articlesArr = resultObj["articles"];

        // 기존 노드 초기화
        resultNode.replaceChildren('');

        for(let i=0; i<articlesArr.length; i++){

            // 작성자가 null인 경우에는 출력하지 않음
            if(articlesArr[i]["author"] == null){
                continue;
            }

            // 서버에서 받은 응답을 출력할 노드 준비
            const newsNode = document.createElement('div'); // 뉴스의 모든 요소를 담을 요소
            newsNode.setAttribute('class','news');
            const contentNode = document.createElement('div'); // 뉴스의 (텍스트)콘텐츠를 담을 요소
            contentNode.setAttribute('class','content');
            const titleNode = document.createElement('h3'); // 뉴스 제목 요소
            titleNode.setAttribute('class','title');
            const infoNode = document.createElement('div'); // 뉴스 정보를 담을 요소
            infoNode.setAttribute('class','info');
            const linkANode = document.createElement('a'); // 뉴스 링크 요소
            linkANode.setAttribute('class','link');
            const descriptionNode = document.createElement('p'); // 뉴스 내용 요소
            descriptionNode.setAttribute('class','description');
            const imgNode = document.createElement('img'); // 뉴스 커버 이미지 요소
            imgNode.setAttribute('class','cover');

            // 뉴스 제목 요소에 제목 텍스트 추가
            let titleTextNode = document.createTextNode(articlesArr[i]["title"]);
            titleNode.appendChild(titleTextNode);

            // 뉴스 링크 요소에 속성 추가
            linkANode.setAttribute('href', '#'); // 하이퍼 링크
            linkANode.setAttribute('onclick', `moveSrcLink("${articlesArr[i]["url"]}", event)`); // 뉴스 url
            linkANode.innerText='more';

            // 뉴스 내용 요소에 내용 텍스트 추가
            let descriptionTextNode = document.createTextNode(articlesArr[i]["description"]);
            descriptionNode.appendChild(descriptionTextNode);

            // 뉴스 커버 이미지 src 속성 추가(이미지가 있는 경우에만)
            if(articlesArr[i]["urlToImage"] !== null){
                imgNode.setAttribute('src', articlesArr[i]["urlToImage"]);
            }

            // 뉴스 정보 노드 추가
            let infoTextNode = document.createTextNode(`${articlesArr[i]["author"]} - ${articlesArr[i]["publishedAt"]} - `); // 작성자 정보, 뉴스 발행 시간
            infoNode.appendChild(infoTextNode); // 작성 정보 추가
            infoNode.appendChild(linkANode); // 링크 노드 추가

            // 뉴스 (텍스트)콘텐츠 노드 추가
            contentNode.appendChild(titleNode); // 뉴스 제목 노드
            contentNode.appendChild(infoNode); // 뉴스 정보 노드
            contentNode.appendChild(descriptionNode); // 뉴스 내용 노드

            // 뉴스 노드 추가
            newsNode.appendChild(contentNode); // 뉴스 (텍스트)콘텐츠 노드 추가
            newsNode.appendChild(imgNode); // 뉴스 커버 이미지 노드 추가
            resultNode.appendChild(newsNode); // 최종 뉴스 요소 결과 노드에 추가
        }
    }
    xhr.send();
})