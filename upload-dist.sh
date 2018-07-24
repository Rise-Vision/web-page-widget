cp -r dist webpage
gsutil -m cp -r webpage gs://install-versions.risevision.com/widgets/
gsutil -m acl -r ch -u AllUsers:R gs://install-versions.risevision.com/widgets/webpage
gsutil -m setmeta -r -h Cache-Control:private,max-age=0 gs://install-versions.risevision.com/widgets/webpage
