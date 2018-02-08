CakePHP 폴더 구성
########################
 
CakePHP 어플리케이션 골격을 다운로드하면 다음과 같이 몇 가지 상위 레벨 폴더가 있습니다.

- *bin* 폴더에는 실행 가능한 Cake 콘솔을 보유하고 있습니다.
- *config* 폴더는 CakePHP가 사용하는 몇 가지의 :doc:`/development/configuration`
  구성 설정 파일이 들어가는 곳입니다. 데이터베이스 접속의 상세 설정, 부트스트랩,
  코어 설정 파일 등이 여기에 포함되어 있습니다.
- *plugins* 폴더는 어플리케이션이 사용하는 :doc:`/plugins` 이 포함되어 있습니다.
- *logs* 폴더는 일반적으로 로그 설정에 따른 로그 파일이 포함되어 있습니다.
- *src* 폴더는 어플리케이션 소스 코드가 배치되는 곳입니다.
- *tests* 폴더는 어플리케이션의 테스트 케이스를 두는 곳입니다.
- *tmp* 폴더는 CakePHP가 임시 데이터를 저장하는 곳입니다.
  저장할 실제 데이터는 CakePHP의 설정 방법에 따라 다르지만 이 폴더는 일반적으로
  번역 메세지, 모델에 대한 상세 정보 및 때에 따라서는 세션 정보를 저장하기위해 사용됩니다.
- *vendor* 폴더는 CakePHP와 타 어플리케이션의 의존 라이브러리가 `Composer
  <http://getcomposer.org>`_ 에 따라 설치되는 곳입니다. 이 파일들을
  수정하는 것은 권장하지 않습니다. 다음 업데이트시 Composer 가 변경한 내용을 덮어쓰기 때문입니다.
- *webroot* 디렉토리는 어플리케이션의 공용 문서 루트입니다. 
  어플리케이션에서 공개하려는 모든 파일이 여기에 포함됩니다.

  *tmp* 폴더와 *logs* 폴더는 항상 쓰기가 가능한 상태로 유지해주시길 바랍니다.
  그렇지 않은 경우, 어플리케이션의 성능에 영향을 줄 수 있습니다.
  이 디렉토리에 쓰기 권한이 부여되지 않은 경우 디버그 모드에서 경고를 출력합니다.

src폴더
===============

어플리케이션 개발의 대부분은 CakePHP의 *src* 폴더내에서 이뤄집니다.
*src* 폴더 안을 조금씩 살펴봅시다.

Controller
    어플리케이션의 컨트롤러와 컴포넌트를 포함합니다.
Locale
    국제화를 위한 문자열 파일을 저장합니다.
Model
    어플리케이션의 테이블, 엔티티, 동작을 포함합니다.
Shell
    어플리케이션에서 사용할 콘솔 명령이나 콘솔 작업이 포함됩니다.
    상세 설명은 :doc:`/console-and-shells` 를 확인하시길 바랍니다.
View
    View용 클래스가 여기에 포함됩니다. 뷰, 셀, 헬퍼 등입니다.
Template
    View용 파일이 여기에 저장됩니다.
    엘리멘트, 에러페이지, 레이아웃, 뷰 템플릿 파일 등입니다.

.. meta::
    :title lang=kr: CakePHP 폴더 구성
    :keywords lang=kr: internal libraries,core configuration,model descriptions,external vendors,connection details,folder structure,party libraries,personal commitment,database connection,internationalization,configuration files,folders,application development,readme,lib,configured,logs,config,third party,cakephp
