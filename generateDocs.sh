#!/bin/bash

cd views/docSections

# list the available sections sorted by the number in the first column
# -n : sorted numerically
# -t : field separator '-'
# -k :  sort on first field
# sections=`ls | sort -n -t - -k 1`
sections=`cat sectionList.txt`
echo "Concatenating sections " ${sections} " ..."

cat ${sections} >> sections.html
mv sections.html ../

echo "Done."

