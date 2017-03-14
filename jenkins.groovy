def final REPO_NAME = 'cakephp/docs'

// Each version of the book has basically the same
// job definition use a string 'template' to save duplication
def final BUILD_STEPS = '''\
# Rebuild the index.
make populate-index ES_HOST="$ELASTICSEARCH_URL"

rm -rf /tmp/book-VERSION-$GIT_COMMIT
git clone . /tmp/book-VERSION-$GIT_COMMIT
cd /tmp/book-VERSION-$GIT_COMMIT

sed -i.bak 's#html populate-index#html#' Makefile
git add Makefile && git commit -m "Add deploy requirements"
NEW_COMMIT=$(git rev-parse HEAD)
git remote rm origin
git branch -D master || true
git checkout -b master

git remote | grep dokku || git remote add dokku dokku@new.cakephp.org:book-VERSION
git push -fv dokku master
rm -rf /tmp/book-VERSION-$GIT_COMMIT
'''

job('Book - Deploy 3.x') {
  description('Deploy the 3.x book when changes are pushed.')
  scm {
    github(REPO_NAME, '3.0')
  }
  triggers {
    scm('H/5 * * * *')
  }
  logRotator {
    daysToKeep(30)
  }
  steps {
    shell(BUILD_STEPS.replaceAll('VERSION', '3'))
  }
  publishers {
    slackNotifications {
      projectChannel('#dev')
      notifyFailure()
      notifyRepeatedFailure()
    }
  }
}

job('Book - Deploy 3.next') {
  description('Deploy the 3.next book when changes are pushed.')
  scm {
    github(REPO_NAME, '3.next')
  }
  triggers {
    scm('H/5 * * * *')
  }
  logRotator {
    daysToKeep(30)
  }
  steps {
    shell(BUILD_STEPS.replaceAll('VERSION', '3next'))
  }
  publishers {
    slackNotifications {
      projectChannel('#dev')
      notifyFailure()
      notifyRepeatedFailure()
    }
  }
}

job('Book - Deploy 2.x') {
  description('Deploy the 2.x book when changes are pushed.')
  scm {
    github(REPO_NAME, 'master')
  }
  triggers {
    scm('H/5 * * * *')
  }
  logRotator {
    daysToKeep(30)
  }
  steps {
    shell(BUILD_STEPS.replaceAll('VERSION', '2'))
  }
  publishers {
    slackNotifications {
      projectChannel('#dev')
      notifyFailure()
      notifyRepeatedFailure()
    }
  }
}

job('Book - Deploy 1.3') {
  description('Deploy the 1.3 book when changes are pushed.')
  scm {
    github(REPO_NAME, '1.3')
  }
  triggers {
    scm('H/5 * * * *')
  }
  logRotator {
    daysToKeep(30)
  }
  steps {
    shell(BUILD_STEPS.replaceAll('VERSION', '13'))
  }
}

job('Book - Deploy 1.2') {
  description('Deploy the 1.2 book when changes are pushed.')
  scm {
    github(REPO_NAME, '1.2')
  }
  triggers {
    scm('H/5 * * * *')
  }
  logRotator {
    daysToKeep(30)
  }
  steps {
    shell(BUILD_STEPS.replaceAll('VERSION', '12'))
  }
}

job('Book - Deploy 1.1') {
  description('Deploy the 1.1 book when changes are pushed.')
  scm {
    github(REPO_NAME, '1.1')
  }
  triggers {
    scm('H/5 * * * *')
  }
  logRotator {
    daysToKeep(30)
  }
  steps {
    shell(BUILD_STEPS.replaceAll('VERSION', '11'))
  }
}

job('Book - Rebuild 2.x search index') {
  description('Rebuild the 2.x search index. Will result in temporary unavailability of search as index is rebuilt.')
  scm {
    github(REPO_NAME, 'master')
  }
  logRotator {
    daysToKeep(30)
  }
  steps {
    shell('make rebuild-index ES_HOST="$ELASTICSEARCH_URL"')
  }
}

job('Book - Rebuild 3.x search index') {
  description('Rebuild the 3.x search index. Will result in temporary unavailability of search as index is rebuilt.')
  scm {
    github(REPO_NAME, '3.0')
  }
  logRotator {
    daysToKeep(30)
  }
  steps {
    shell('make rebuild-index ES_HOST="$ELASTICSEARCH_URL"')
  }
}
