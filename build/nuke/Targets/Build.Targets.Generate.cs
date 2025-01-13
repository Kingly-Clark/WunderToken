#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously

using System.Threading.Tasks;
using Nuke.Common.IO;
using Nuke.Common.Tools.DotNet;
using Nuke.Common.Tools.PowerShell;
using Nuke.Common.Utilities.Collections;
using static Nuke.Common.IO.FileSystemTasks;
using static Nuke.Common.Tools.DotNet.DotNetTasks;

partial class Build
{
    async Task GenerateNetheriumProject()
    {
        PowerShellTasks.PowerShell($"dotnet new classlib -n {MainProjectName}");
        PowerShellTasks.PowerShell($"rm ./{MainProjectName}/class1.cs");
        PowerShellTasks.PowerShell($"cd {MainProjectName}; dotnet add package Nethereum.Web3");
        PowerShellTasks.PowerShell($"Nethereum.Generator.Console generate from-abi -abi {AbiPath} -ns Wunder -o ./{MainProjectName}");
    }
}
