from github import Github

def getBranch(commit, branch):
    if(commit.sha == branch.commit.commit.sha):
        name = branch.name
        # print(c.commit.message)
        # print("NAME IS " + name)
        return name
    else:
        # print("here")
        if(len(commit.parents) < 1):
            print("YEEEHAAW")
            return "Master"
        for parent in commit.parents:
            return getBranch(parent, branch)

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
# f = open(repoName+".tsv", "w+")
# f.write("author\ttime\tparents\tmessage\tsha\tchanges\tadditions\tdeletions\tfiles\n")
branch_list = list(r.get_branches())
i = 0
branch_name = ""
for commit in commit_list:
#     f.write(str(commit.commit.author.name))
#     f.write("\t")
#     f.write(str(commit.commit.author.date))
#     f.write("\t")
#     parents = []
#     for parent in commit.commit.parents:
#         parents.append(parent.sha)
#     f.write(str(parents))
#     f.write("\t")
#     f.write(str(commit.commit.message).replace("\n","").replace("\t",""))
#     f.write("\t")
#     f.write(str(commit.commit.sha))
#     f.write("\t")
#     changes = []
#     additions = []
#     deletions = []
#     filename = []
#     for tempfile in commit.files:
#         changes.append(tempfile.changes)
#         additions.append(tempfile.additions)
#         deletions.append(tempfile.deletions)
#         filename.append(tempfile.filename)
#     f.write(str(changes))
#     f.write("\t")
#     f.write(str(additions))
#     f.write("\t")
#     f.write(str(deletions))
#     f.write("\t")
#     f.write(str(filename))
#     f.write("\t")
#     f.write("\n")
#     # print(commit.commit.parents)
#     #print(commit.files[0].changes)
    # name = ""
    # c = commit
    # for branch in branch_list:
    #     head = branch.commit.commit.sha
    #     if(commit.commit.sha == head):
    #         name = branch.name
    #         print("DIR NAME IS " + name)
    #     else:
    #         print(getBranch(commit, branch))
            # while(name == ""):
            # for parent in c.parents:
            #     if(parent.sha == head):
            #         name = branch.name
            #         # print(c.commit.message)
            #         # print("NAME IS " + name)
            #         break
            # #NONE OF THE PARENTS ARE A BRANCH HEAD
            # for parent in c.parents:
            #     c = parent
            # if (len(c.parents) > 0):
            #     c = c.parents[0]
            # elif(len(c.parents)>1):
            #     print(branch.name)
            # else:
            #     name = branch.name
                # print(c)
    

    # print(i)
    # for branch in branch_list:
    #     if(commit.sha == branch.commit.sha):
    #         name = branch.name
    #         print(name + commit.message)
    # print(name + commit.commit.message)
    i+=1
print(list(r.get_git_refs())[0].ref)
print(branch_list)
# f.close()
print("FINISHED")
# for repo in g.get_user().get_repos():
#     print(repo.name)
    #repo.edit(has_wiki=False)
    # to see all the available attributes and methods
    #print(dir(repo))
