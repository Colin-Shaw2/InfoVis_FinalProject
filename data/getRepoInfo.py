from github import Github

# using username and password
#g = Github("user", "password")

# or using an access token


# Change these three lines to get a new repo
g = Github("5a621998e641186df69f66d0557a9fa383ef9062")
userName = "Colin-Shaw2/"
repoName = "CSCI_3090_Final"
# repoName = "SQA_Project"

r = g.get_repo(userName+repoName)
commit_list = list(r.get_commits())
print("Reading info from " + repoName)
f = open(repoName+".tsv", "w+")
f.write("Author\tTimes\tParents\tMessage\tsha\tchanges\tadditions\tdeletions\tfiles\n")
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
    f.write("\n")
    # print(commit.commit.parents)
    #print(commit.files[0].changes)
f.close()
print("FINISHED")
# for repo in g.get_user().get_repos():
#     print(repo.name)
    #repo.edit(has_wiki=False)
    # to see all the available attributes and methods
    #print(dir(repo))