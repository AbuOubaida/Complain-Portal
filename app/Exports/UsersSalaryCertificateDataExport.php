<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;

class UsersSalaryCertificateDataExport implements FromCollection
{
    public function collection()
    {
        $data = [
            [
                'Employee ID*',
                'Name',
                'Department',
                'Financial Year From*',
                'Financial Year To*',
                'Basic*',
                'House Rent*',
                'Conveyance*',
                'Medical Allowance*',
                'Total',
                'Festival Bonus*',
                'Others',
                'Remarks'
            ]
        ];

        $users = User::with(['getDepartment', 'getBranch'])->where('status', 1)->get();

        foreach ($users as $user) {
            $data[] = [
                $user->employee_id,
                $user->name,
                $user->getDepartment->dept_name,
                date('M-Y', strtotime('Jul'.(date('Y')-1))),
                date('M-Y', strtotime('Jun'.date('Y'))),
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                'NULL',
            ];
        }

        return collect($data);
    }
}
