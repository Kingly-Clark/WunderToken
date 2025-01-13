using System;
using System.Linq;
using Nuke.Common;
using Nuke.Common.Git;
using Nuke.Common.IO;
using Nuke.Common.ProjectModel;
using Nuke.Common.Tools.GitVersion;

partial class Build
{
    string MainProjectName = "WunderToken.Contracts";

    [Parameter("Configuration to build - Default is 'Debug' (local) or 'Release' (server)")]
    readonly Configuration Configuration = IsLocalBuild ? Configuration.Debug : Configuration.Release;

    // GENERAL DIRECTORIES
    //------------------------------------------------------------------------------------------------------------------
    AbsolutePath ArtifactsDirectory => RootDirectory / "artifacts";
    AbsolutePath NuGetArtifactsDirectory => ArtifactsDirectory / "nuget";
    AbsolutePath SourceDirectory => RootDirectory;
    AbsolutePath MainProjectPath => SourceDirectory / MainProjectName;
    AbsolutePath AbiPath => RootDirectory / "bin" / "contracts" / "WunderTokenV2.abi";

    // GIT CONFIG
    //------------------------------------------------------------------------------------------------------------------
    [GitRepository] readonly GitRepository GitRepository;
    [GitVersion] readonly GitVersion GitVersion;

    // FEEDS
    //------------------------------------------------------------------------------------------------------------------
    [Parameter("KC NuGet Feed")]
    string NuGetFeed = "https://proget-kc.azurewebsites.net/nuget/nuget/v3/index.json";
}