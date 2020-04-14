from github import Github

# using username and password
#g = Github("user", "password")

# or using an access token


# Change these three lines to get a new repo
g = Github("5a621998e641186df69f66d0557a9fa383ef9062")
userName = "Colin-Shaw2/"
# repoName = "CSCI_3090_Final"
# repoName = "SQA_Project"
repoName = "SushiGo"

r = g.get_repo(userName+repoName)
commit_list = list(r.get_commits())
print("Reading info from " + repoName)
f = open("data/"+ repoName+"test.tsv", "w+")
f.write("author\ttime\tparents\tmessage\tsha\tchanges\tadditions\tdeletions\tfiles\tbranch\n")
branch_list = r.get_branches()
for commit in commit_list:
    f.write(str(commit.commit.author.name))
    f.write("\t")
    f.write(str(commit.commit.author.date))
    f.write("\t")
    parents = []
    for parent in commit.commit.parents:
        parents.append(parent.sha)
    f.write(str(parents))
    f.write("\t")
    f.write(str(commit.commit.message).replace("\n","").replace("\t",""))
    f.write("\t")
    f.write(str(commit.commit.sha))
    f.write("\t")
    changes = []
    additions = []
    deletions = []
    filename = []
    for tempfile in commit.files:
        changes.append(tempfile.changes)
        additions.append(tempfile.additions)
        deletions.append(tempfile.deletions)
        filename.append(tempfile.filename)
    f.write(str(changes))
    f.write("\t")
    f.write(str(additions))
    f.write("\t")
    f.write(str(deletions))
    f.write("\t")
    f.write(str(filename))
    f.write("\t")
    # Determine what branch the commit is in
    name = ""
    for branch in branch_list:
        head = branch.commit.commit.sha
        if(commit.commit.sha == head):
            f.write(str(branch.name))
            f.write("\n")
            name = branch.name
    if (name == ""):
        f.write("master")
        f.write("\n")
print(branch_list)
f.close()
print("FINISHED")